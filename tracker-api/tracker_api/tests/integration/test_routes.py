# integration testing for url routes

import pytest
from faker import Faker
from datetime import date, timedelta
from tracker_api.user import User
from tracker_api.timetable import Timetable
from tracker_api.helpers import date_keys_to_strings

faker = Faker()


@pytest.fixture
def user(app):
    profile = faker.simple_profile()
    data_access_class = app.config["DATA_ACCESS"]
    test_user = User(
        username=profile["username"],
        data_access=data_access_class(),
    )
    return test_user


@pytest.fixture
def auth_token(app, db, cli, user):
    user.save(password="testpass")
    res = cli.post(
        "/token",
        json={"username": user.username, "password": "testpass"},
    )

    return res.get_json().get("data").get("token")


@pytest.fixture
def task_timetable(app, user, work_times, auth_token):
    """empty timetable with tasks created for it"""
    timetable = Timetable(user, user.data_access)
    for _, task_dict in work_times.items():
        for task, _ in task_dict.items():
            timetable.add_task(task)

    return timetable


@pytest.fixture
def recorded_timetable(user, work_times, task_timetable):
    """timetable with recorded work"""
    task_timetable.record_work_time(work_times)
    return task_timetable


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


def test_get_work_week(db, cli, auth_token, recorded_timetable):
    """
    given recorded times on tasks over a week
    when querying for that work week
    then the times for that work week will be provided
    """
    res = cli.get(
        "/work-tracking/2021/3/20", headers={"Authorization": "Bearer " + auth_token}
    )

    json = res.get_json()
    assert res.status_code == 200
    assert json["status"] == "success"

    day = date(2021, 3, 20).isoformat()
    next_day = date(2021, 3, 21).isoformat()
    assert json["data"][day]["task1"]["minutes_spent"] == 40
    assert json["data"][next_day]["task2"]["minutes_spent"] == 20


def test_work_week_bad_date_input(db, cli, auth_token, recorded_timetable):
    """
    given recorded times on tasks over a week
    when attempting to query for a week that does not exist
    then the endpoint will produce an error
    """
    # the 69th of march does not exist
    res = cli.get(
        "/work-tracking/2021/3/69", headers={"Authorization": "Bearer " + auth_token}
    )

    assert res.get_json()["status"] == "error"
    assert res.status_code == 400


def test_add_new_task(db, cli, user, auth_token):
    """
    given existing user
    when adding new task
    then new task is created
    """
    res = cli.post(
        "/task",
        headers={"Authorization": "Bearer " + auth_token},
        json={"name": "my-new-task"},
    )

    assert res.status_code == 200
    timetable = Timetable(user, user.data_access)
    assert "my-new-task" in [task.name for task in timetable.tasks()]


def test_do_not_add_new_task_without_name_given(db, cli, auth_token):
    """
    given existing user
    when adding new task without providing name
    then new task is not created
    """
    res = cli.post(
        "/task",
        headers={"Authorization": "Bearer " + auth_token},
        json={"asdf": "jkl;"},
    )

    assert res.status_code == 400


def test_do_not_add_new_task_with_blank_name(db, cli, auth_token):
    """
    given existing user
    when adding new task without providing name
    then new task is not created
    """
    res = cli.post(
        "/task",
        headers={"Authorization": "Bearer " + auth_token},
        json={"name": ""},
    )

    assert res.status_code == 400


def test_do_not_add_new_task_with_missing_json_data(db, cli, auth_token):
    """
    given existing user
    when attempting to add task without providing json data
    then new task is not created
    """
    res = cli.post(
        "/task",
        headers={"Authorization": "Bearer " + auth_token},
    )

    assert res.status_code == 400


def test_record_work_time(db, cli, auth_token, task_timetable, work_times):
    """
    given existing user with tasks
    when recording time spent on tasks
    then the time is recorded
    """
    res = cli.put(
        "/work-tracking",
        headers={"Authorization": "Bearer " + auth_token},
        json=date_keys_to_strings(work_times),
    )
    assert res.status_code == 200

    # retrieve work times to check they're recorded
    json_data = (
        cli.get(
            "/work-tracking/2021/3/20",
            headers={"Authorization": "Bearer " + auth_token},
        )
        .get_json()
        .get("data")
    )
    day = date(2021, 3, 20).isoformat()
    next_day = date(2021, 3, 21).isoformat()
    assert json_data[day]["task1"]["minutes_spent"] == 40
    assert json_data[next_day]["task2"]["minutes_spent"] == 20


def test_fail_record_work_times_given_invalid_json(db, cli, auth_token, task_timetable):
    res = cli.put(
        "/work-tracking",
        headers={"Authorization": "Bearer " + auth_token},
        json=date_keys_to_strings({"asdf": "asdfasdf"}),  # invalid format
    )
    assert res.status_code == 400


def test_retrieve_tasks_of_user(db, cli, auth_token, task_timetable):
    res = cli.get(
        "/task",
        headers={"Authorization": "Bearer " + auth_token},
    )

    assert res.status_code == 200
    assert len(res.get_json().get("data")) == 2


def test_set_task_inactive(db, cli, auth_token, task_timetable):
    res = cli.patch(
        "/task/task1",
        headers={"Authorization": "Bearer " + auth_token},
        json={"active": False},
    )
    assert res.status_code == 200

    res = cli.get(
        "/task",
        headers={"Authorization": "Bearer " + auth_token},
    )
    json_data = res.get_json().get("data")

    assert res.status_code == 200
    assert any(
        task["name"] == "task1" and task["active"] == False for task in json_data
    )


def test_fail_set_task_inactive_given_nonexistent_task(db, cli, auth_token):
    res = cli.patch(
        "/task/nonexistent-task",
        headers={"Authorization": "Bearer " + auth_token},
        json={"active": False},
    )

    assert res.status_code == 400
