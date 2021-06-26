# unit tests logic for time recording

import pytest
from tracker_api.user import User
from tracker_api.timetable import Timetable, Task
from datetime import date

# dummy class to avoid needing the database for unit tests
class DataAccessStub:

    def record_work_time(self, work):
        pass

    def work_week(self, year, week):
        pass

    def commit(self):
        pass

@pytest.fixture
def user():
    data_access=DataAccessStub()
    return User(username="alfonse", password_hash='secrethash', data_access=data_access)

@pytest.fixture
def timetable(user):
    data_access=DataAccessStub()
    test_timetable = Timetable(user=user, data_access=data_access)
    
    return test_timetable

def test_creates_valid_task(user):
    """
    given valid input
    when creating a task
    task is created successfully
    """
    task = Task('my-task', True, user)
    assert(task.active is True)

def test_empty_task_name_is_invalid(user):
    """
    given empty task name
    when creating a task
    task fails validation
    """
    with pytest.raises(ValueError):
        task = Task('', True, user)

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
        timetable.record_work_time({
            "asdf": "asdf"
        })

def test_timetable_fails_recording_time_given_negative_time(timetable, work_times):
    """
    given negative time spent on a task
    when recording time spent on tasks
    time recording does not pass validation
    """
    with pytest.raises(ValueError):
        work_times[date(2021, 3, 20)]['task1']['minutes_spent'] = -20
        timetable.record_work_time(work_times)

# def test_record_time_user_spent_on_tasks(timetable, work_times):
#     """
#     given valid user and tasks
#     when time spent on tasks is recorded
#     then the times are recorded successfully
#     """

#     timetable.record_work_time(work=work_times)
    
#     day = work_times[0]["day"]
#     recorded_time = timetable.work_week(year=day.year, week=day.isocalendar()[1])
#     assert(recorded_time["task1"]["Mon"] is 20 and recorded_time["task2"]["Tue"] is 40)

# def test_fail_recording_time_with_nonexistent_tasks(timetable, work_times):
#     """
#     given valid user and tasks
#     when attempting to record time on a nonexistent task
#     the times fail to be recorded
#     """
#     timetable.add_task(name="task1")
#     # 'task2' doesn't exist

#     with pytest.raises(ValueError):
#         timetable.record_work_time(work=work_times)
        