# sqlalchemy database integration tests

import pytest
from tracker_api.user import User
from tracker_api.data_access.data_access import SQLAlchemyDataAccess, UserModel

@pytest.fixture
def data_access():
    return SQLAlchemyDataAccess()

# def test_persist_work_times(db, work_times, data_access):
#     """
#     given valid user and times spent working
#     when work data is to be persisted
#     then the data is saved to the database successfully
#     """
#     user = User('Bob', data_access)

#     data_access.add_user()
#     data_access.record_work_time(user, work_times)

#     day = work_times[0]["day"]
#     recorded_time = data_access.work_week(user=user, year=day.year, week=day.isocalendar()[1])
#     assert(recorded_time["task1"]["Mon"] is 20 and recorded_time["task2"]["Tue"] is 40)


def test_persist_new_user(db, data_access):
    user = User(username='Bob', password_hash='secretpasswordhash', data_access=data_access)
    data_access.add_user(user)
    assert(UserModel.query.filter_by(username=user.username).first() is not None)