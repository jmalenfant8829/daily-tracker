# a "service layer" of sorts for data access
# definitely abstraction overkill for a little side project like this, but i'm trying to practice decoupling infrastructure and app code.
# it also spares time changing orm access code all around the app if i change the schema.
#
# as a bonus, i'm thinking of ripping out the sqlalchemy db access to get some practice with nosql,
#   so this allows me to easily switch it out if i choose to.

from datetime import date, timedelta
from collections import defaultdict
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

from tracker_api.data_access.sqlalchemy import (
    UserModel,
    TaskModel,
    DailyTaskTimeModel,
    db,
)
from tracker_api.data_access.exc import DataAccessError
from tracker_api.user import User
from tracker_api.timetable import Task

DAYS_IN_WEEK = 7

DUPLICATE_USER_ERR_MSG = "User already exists"


class SQLAlchemyDataAccess:
    def add_user(self, user, password_hash):
        if UserModel.query.filter_by(username=user.username).first() is not None:
            raise DataAccessError(DUPLICATE_USER_ERR_MSG)

        db_user = UserModel(username=user.username, hash=password_hash)
        db.session.add(db_user)
        return db_user

    def user_by_username(self, username):
        """query for user by username"""
        db_user = UserModel.query.filter_by(username=username).first()
        if db_user:
            return User(username=username, data_access=self)
        else:
            return None

    def hashed_password(self, user):
        """get user's password hash"""
        db_user = UserModel.query.filter_by(username=user.username).first()
        if db_user:
            return db_user.hash
        else:
            return None

    def add_task(self, task):
        db_user = UserModel.query.filter_by(username=task.user.username).first()

        if not db_user:
            raise ValueError('User "' + task.user.username + '" not found')

        db_task = TaskModel(name=task.name, active=task.active)
        db_user.tasks.append(db_task)
        return db_task

    def work_week(self, user, start) -> dict:
        """
        Gets times a user worked for each task across a week starting from provided day
        """
        work_times_query = (
            DailyTaskTimeModel.query.filter(
                DailyTaskTimeModel.day.between(
                    start, start + timedelta(days=DAYS_IN_WEEK)
                )
            )
            .join(DailyTaskTimeModel.task)
            .join(TaskModel.user)
            .filter_by(username=user.username)
        )

        # build response from query results
        nested_dict = lambda: defaultdict(nested_dict)
        work_times = {}
        for result in work_times_query:
            if work_times.get(result.task.name, None) is None:
                work_times[result.task.name] = []

            work_times[result.task.name].append(
                {
                    "date": result.day,
                    "minutes_spent": result.minutes_spent,
                }
            )

        return work_times

    def record_work_time(self, user, work):
        """
        Records work time to DB by adding/updating a daily task time record
        """
        # get user's tasks / task times
        db_user = (
            UserModel.query.options(
                selectinload(UserModel.tasks).selectinload(TaskModel.task_times)
            )
            .filter_by(username=user.username)
            .first()
        )

        if not db_user:
            raise ValueError('User "' + user.username + '" not found')

        # record each task time record specified as long the task exists
        for task_name, task_times in work.items():
            for task_time in task_times:
                try:
                    task_index = [t.name for t in db_user.tasks].index(task_name)
                    db_task = db_user.tasks[task_index]
                    try:
                        # attempt updating existing record
                        task_time_index = [t.day for t in db_task.task_times].index(
                            task_time["date"]
                        )
                        db_task_time = db_task.task_times[task_time_index]
                        db_task_time.minutes_spent = task_time["minutes_spent"]
                    except ValueError:
                        # record does not yet exist; create it
                        db_task_time = DailyTaskTimeModel(
                            day=task_time["date"],
                            minutes_spent=task_time["minutes_spent"],
                        )
                        db_task.task_times.append(db_task_time)
                except ValueError:
                    # user has no task with that name; skip it
                    pass

    def tasks(self, user):
        """retrieve all tasks for a user"""
        db_tasks = UserModel.query.filter_by(username=user.username).first().tasks

        tasks = []
        for task in db_tasks:
            tasks.append(Task(task.name, task.active, user))
        return tasks

    def modify_task(self, task):
        """modify a user's task"""
        db_task = (
            TaskModel.query.filter_by(name=task.name)
            .join(UserModel)
            .filter_by(username=task.user.username)
            .first()
        )

        if not db_task:
            raise DataAccessError(
                'Task "'
                + task.name
                + '" does not exist for user "'
                + task.user.username
                + '"'
            )

        db_task.active = task.active

    def commit(self):
        try:
            db.session.commit()
        except SQLAlchemyError as e:
            raise DataAccessError(str(e))

    def rollback(self):
        db.session.rollback()
