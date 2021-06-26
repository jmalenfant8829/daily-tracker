# a "service layer" of sorts for data access - meant to be easily mocked out / changed without affecting the core domain objects
# definitely abstraction overkill for a little side project like this, but i'm trying to practice decoupling infrastructure and app code.
# it also spares time changing orm access code all around the app when i change the schema.
# as a bonus, i'm thinking of ripping out the sqlalchemy db access to get some practice with nosql,
#   so this allows me to easily switch it out if i choose to.

from datetime import date, timedelta
from collections import defaultdict
from tracker_api.data_access.sqlalchemy import UserModel, TaskModel, DailyTaskTimeModel, db
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import SQLAlchemyError

DAYS_IN_WEEK = 7

class DataAccessError(Exception):
    pass

class SQLAlchemyDataAccess:

    def add_user(self, user):
        db_user = UserModel(username=user.username, hash=user.hash)
        db.session.add(db_user)
        return db_user

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
        work_times_query = DailyTaskTimeModel.query\
            .filter(DailyTaskTimeModel.day.between(start, start + timedelta(days=DAYS_IN_WEEK)))\
            .join(DailyTaskTimeModel.task)\
            .join(TaskModel.user)\
            .filter_by(username=user.username)

        nested_dict = lambda: defaultdict(nested_dict)
        work_times = nested_dict()
        for work_time in work_times_query:
            work_times[work_time.day][work_time.task.name]['minutes_spent'] = work_time.minutes_spent

        return work_times

    def record_work_time(self, user, work):
        """
        Saves work time to DB by adding/updating a daily task time record
        """
        # get user's tasks / task times
        db_user = UserModel\
            .query.options(selectinload(UserModel.tasks).selectinload(TaskModel.task_times))\
            .filter_by(username=user.username).first()

        if not db_user:
            raise ValueError('User "' + user.username + '" not found')

        # record each task time record specified as long the task exists
        for day, tasks in work.items():
            for task_name, values in tasks.items():
                try:
                    task_index = [t.name for t in db_user.tasks].index(task_name)
                    db_task = db_user.tasks[task_index]
                    try:
                        # attempt updating existing record
                        task_time_index = [t.day for t in db_task.task_times].index(day)
                        db_task_time = db_task.task_times[task_time_index]
                        db_task_time.minutes_spent = values["minutes_spent"]
                    except ValueError:
                        # record does not yet exist; create it
                        db_task_time = DailyTaskTimeModel(day=day, minutes_spent=values["minutes_spent"])
                        db_task.task_times.append(db_task_time)
                except ValueError:
                    # user has no task with that name; skip it
                    pass

    def commit(self):
        try:
            db.session.commit()
        except SQLAlchemyError:
            raise DataAccessError

    def rollback(self):
        db.session.rollback()