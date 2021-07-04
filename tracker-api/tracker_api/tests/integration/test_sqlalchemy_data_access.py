# sqlalchemy database integration tests

import pytest
from tracker_api.data_access.sqlalchemy import DailyTaskTimeModel, TaskModel
from tracker_api.user import User
from tracker_api.timetable import Task
from tracker_api.data_access.data_access import (
    SQLAlchemyDataAccess,
    UserModel,
    DataAccessError,
)
from datetime import date, timedelta


@pytest.fixture
def data_access():
    return SQLAlchemyDataAccess()


@pytest.fixture
def user(data_access):
    return User("Bob", data_access)


def test_persist_work_times(db, work_times, data_access, user):
    """
    given valid user and times spent working
    when work data is to be persisted
    then the data is saved to the database successfully
    """
    day1 = date(2021, 3, 20)
    day2 = day1 + timedelta(days=1)

    data_access.add_user(user, "secretpasswordhash")

    task1 = Task("task1", True, user)
    task2 = Task("task2", True, user)
    data_access.add_task(task1)
    data_access.add_task(task2)

    data_access.record_work_time(user, work_times)
    data_access.commit()

    assert DailyTaskTimeModel.query.filter_by(day=day1).first().task.name == task1.name
    assert DailyTaskTimeModel.query.filter_by(day=day2).first().task.name == task2.name


def test_update_work_times(db, work_times, data_access, user):
    """
    given existing times in the database
    when a work time is updated
    the updated time should be reflected in the database, leaving the other records intact
    """
    day1 = date(2021, 3, 20)
    day2 = day1 + timedelta(days=1)

    data_access.add_user(user, "secretpasswordhash")

    task1 = Task("task1", True, user)
    task2 = Task("task2", True, user)
    data_access.add_task(task1)
    data_access.add_task(task2)

    data_access.record_work_time(user, work_times)
    data_access.commit()

    # update time spent for one of the work times
    updated_time = {
        day1: {
            task1.name: {"minutes_spent": 200},
        },
    }

    data_access.record_work_time(user, updated_time)
    data_access.commit()

    assert DailyTaskTimeModel.query.filter_by(day=day1).first().minutes_spent == 200
    assert (
        DailyTaskTimeModel.query.filter_by(day=day2).first().minutes_spent
        == work_times[day2][task2.name]["minutes_spent"]
    )


def test_persist_new_user(db, data_access, user):
    """
    given valid user
    when user is to be persisted
    then the user is saved to the database successfully
    """
    password_hash = "test"
    data_access.add_user(user=user, password_hash=password_hash)
    data_access.commit()

    assert UserModel.query.filter_by(username=user.username).first() is not None


def test_fail_persist_identical_username(db, data_access, user):
    """
    given valid user
    when user is added twice
    then the second user fails to save
    """
    data_access.add_user(user, "secretpasswordhash")
    data_access.commit()

    with pytest.raises(DataAccessError):
        data_access.add_user(user, "secretpasswordhash")


def test_persist_new_task(db, data_access, user):
    """
    given valid task
    when task is is added
    then the task is saved to the db
    """
    data_access.add_user(user, "secretpasswordhash")
    task = Task("task1", True, user)
    data_access.add_task(task)
    data_access.commit()

    assert TaskModel.query.filter_by(name="task1").first() is not None


def test_fail_persist_identical_task(db, data_access, user):
    """
    given valid task
    when task with identical name/user is added again
    then the second task fails to save
    """
    data_access.add_user(user, "secretpasswordhash")
    task = Task("task1", True, user)
    data_access.add_task(task)
    data_access.add_task(task)

    with pytest.raises(DataAccessError):
        data_access.commit()


def test_query_work_week(db, data_access, user, work_times):
    """
    given recorded times on tasks over a week
    when querying for that work week
    then the task times for that week appear
    """
    day = date(2021, 3, 20)

    data_access.add_user(user, "secretpasswordhash")

    task1 = Task("task1", True, user)
    task2 = Task("task2", True, user)
    data_access.add_task(task1)
    data_access.add_task(task2)

    data_access.record_work_time(user, work_times)
    data_access.commit()

    recorded_time = data_access.work_week(user=user, start=day)
    assert recorded_time[day]["task1"]["minutes_spent"] == 40
    assert recorded_time[day + timedelta(days=1)]["task2"]["minutes_spent"] == 20


def test_get_user_by_username(db, data_access, user):
    """
    given existing user
    when querying for user by username
    user will appear in results
    """
    data_access.add_user(user, "secretpasswordhash")
    assert data_access.user_by_username(user.username).username == user.username


def test_hash_user_password_on_registration(db, data_access, user):
    """
    given existing user
    when registering a new user
    user's password will be hashed
    """
    password = "testpassword"
    user.save(password=password)

    # password_correct() checks the hashed value from the db
    assert user.password_correct(password) is True
