# integration testing for url routes

import pytest
from faker import Faker
from datetime import date, timedelta
from tracker_api.user import User
from tracker_api.timetable import Timetable

faker = Faker()


@pytest.fixture
def cli(app):
    return app.test_client()


@pytest.fixture
def user(app):
    profile = faker.simple_profile()
    data_access_class = app.config["DATA_ACCESS"]
    test_user = User(
        username=profile["username"],
        password_hash=faker.password(),
        data_access=data_access_class(),
    )
    return test_user


@pytest.fixture
def recorded_timetable(app, user, work_times):
    """timetable with recorded work"""
    user.save()

    timetable = Timetable(user, user.data_access)
    for _, task_dict in work_times.items():
        for task, _ in task_dict.items():
            timetable.add_task(task)

    timetable.record_work_time(work_times)
    return timetable


def test_404_returns_json_error_response(cli):
    """
    given a nonexistent url path
    when path is accessed in the API
    a 404 response with a JSON response body is given
    """
    res = cli.get("/this/path/does/not/exist")

    json = res.get_json()
    assert res.status_code == 404
    assert json["status"] == "error"
    assert json["data"] == None


def test_get_work_week(db, cli, work_times, recorded_timetable):
    """
    given recorded times on tasks over a week
    when querying for that work week
    then the times for that work week will be provided
    """
    res = cli.get("/" + recorded_timetable.user.username + "/work-tracking/2021/3/20")

    json = res.get_json()
    assert res.status_code == 200
    assert json["status"] == "success"

    day = date(2021, 3, 20).isoformat()
    next_day = date(2021, 3, 21).isoformat()
    assert json["data"][day]["task1"]["minutes_spent"] == 40
    assert json["data"][next_day]["task2"]["minutes_spent"] == 20


# test bad date input
