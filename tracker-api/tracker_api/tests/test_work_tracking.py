
import pytest
from tracker_api.user import User
from tracker_api.timetable import Timetable

class DataAccessStub:

    

    def record_work_time(self, work):
        pass

    def work_week(self, year, week):
        return {
            "task1": {
                "Mon": 20,
            },
            "task2": {
                "Tue": 40,
            },            
        }

@pytest.fixture
def user():
    data_access=DataAccessStub()
    return User(username="alfonse", password_hash='secrethash', data_access=data_access)

@pytest.fixture
def timetable(user):
    data_access=DataAccessStub()
    test_timetable = Timetable(user=user, data_access=data_access)
    
    return test_timetable

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
        