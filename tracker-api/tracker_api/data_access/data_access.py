# a "service layer" of sorts for data access - meant to be easily mocked out / changed without affecting the core domain objects
# definitely abstraction overkill for a little side project like this, but i'm trying to practice decoupling infrastructure and app code.
# it also spares time changing orm access code all around the app when i change the schema.
# as a bonus, i'm thinking of ripping out the sqlalchemy db access to get some practice with nosql,
#   so this allows me to easily switch it out if i choose to.

from tracker_api.data_access.sqlalchemy import UserModel, TaskModel, DailyTaskTimeModel, db
from sqlalchemy.orm import selectinload

class SQLAlchemyDataAccess:

    def add_user(self, user):
        db_user = UserModel(username=user.username, hash=user.hash)
        db.session.add(db_user)
        db.session.commit()
        return db_user

        
    def work_week(self, year, week):
        """
        
        """
        pass

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

        # record task time as long as task exists
        for task_time in work:
            if task_time["day"] in db_user.tasks:
                daily_time = DailyTaskTimeModel(day=task_time["day"], minutes_spent=task_time["minutes_spent"])

            
        db.session.commit()