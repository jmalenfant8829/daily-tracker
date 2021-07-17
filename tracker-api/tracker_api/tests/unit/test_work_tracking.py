# unit tests logic for time recording

import pytest
from datetime import date
from tracker_api.user import User
from tracker_api.timetable import Timetable, Task
from tracker_api.tests.conftest import DataAccessStub


@pytest.fixture
def user():
    data_access = DataAccessStub()
    return User(username="alfonse", data_access=data_access)


@pytest.fixture
def timetable(user):
    data_access = DataAccessStub()
    test_timetable = Timetable(user=user, data_access=data_access)

    return test_timetable


def test_creates_valid_task(user):
    """
    given valid input
    when creating a task
    task is created successfully
    """
    task = Task("my-task", True, user)
    assert task.active is True


def test_empty_task_name_is_invalid(user):
    """
    given empty task name
    when creating a task
    task fails validation
    """
    with pytest.raises(ValueError):
        task = Task("", True, user)


def test_timetable_records_time_given_valid_input(timetable, work_times):
    """
    given valid input
    when recording time spent on tasks
    time recording passes without error
    """
    # no exception should be thrown
    timetable.record_work_time(work_times)


def test_timetable_fails_recording_time_given_incorrect_format(timetable):
    """
    given an improperly formatted work times dictionary
    when recording time spent on tasks
    time recording does not pass validation
    """
    with pytest.raises(ValueError):
        timetable.record_work_time({"asdf": "asdf"})


def test_timetable_fails_recording_time_given_negative_time(timetable, work_times):
    """
    given negative time spent on a task
    when recording time spent on tasks
    time recording does not pass validation
    """
    with pytest.raises(ValueError):
        work_times[date(2021, 3, 20)]["task1"]["minutes_spent"] = -20
        timetable.record_work_time(work_times)
