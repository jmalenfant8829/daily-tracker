# url routing for work tracking api

from datetime import date
from flask import Blueprint, current_app, request
from tracker_api.data_access.exc import DataAccessError
from tracker_api.user import User
from tracker_api.timetable import Timetable, Task
from tracker_api.routes.auth import jwt_token_required, json_data_required
from .err_msgs import *

work_tracking_bp = Blueprint("work-tracking", __name__)

@work_tracking_bp.route("/work-tracking", methods=["PUT"])
@jwt_token_required
@json_data_required
def work_tracking(username):
    data_access = current_app.config["DATA_ACCESS"]()
    user = User(username, data_access)
    timetable = Timetable(user, data_access)

    try:
        timetable.record_work_time(request.get_json())
    except ValueError as e:
        return {
            "status": "error",
            "data": None,
            "message": str(e),
        }, 400

    return {
        "status": "success",
        "data": None,
        "message": None,
    }, 200


@json_data_required
def add_task(username):
    """
    adds a new task, returning an http response
    """
    # add new task
    task_name = request.get_json().get("name")
    if not task_name:
        return {
            "status": "error",
            "data": None,
            "message": "Must provide task name",
        }, 400

    data_access = current_app.config["DATA_ACCESS"]()
    user = User(username, data_access)
    timetable = Timetable(user, data_access)

    try:
        timetable.add_task(task_name)
    except ValueError as e:
        return {
            "status": "error",
            "data": None,
            "message": str(e),
        }, 400

    return {
        "status": "success",
        "data": None,
        "message": None,
    }, 200


@work_tracking_bp.route("/task", methods=["GET", "POST"])
@jwt_token_required
def task(username):

    if request.method == "POST":
        return add_task(username)
    else:
        # get all of user's tasks
        data_access = current_app.config["DATA_ACCESS"]()
        user = User(username, data_access)
        timetable = Timetable(user, data_access)
        try:
            tasks = timetable.tasks()
        except DataAccessError:
            return {
                "status": "error",
                "data": None,
                "message": DATA_RETRIEVAL_ERR_MSG,
            }, 500
        except Exception as e:
            pass

        return {
            "status": "success",
            "data": [{"name": task.name, "active": task.active} for task in tasks],
            "message": None,
        }, 200


@work_tracking_bp.route("/work-tracking/<year>/<month>/<day>", methods=["GET"])
@jwt_token_required
def work_week(
    username,
    year,
    month,
    day,
):
    # parse date input into numbers
    try:
        year = int(year)
        month = int(month)
        day = int(day)
        start_date = date(year=year, month=month, day=day)
    except ValueError:
        return {
            "status": "error",
            "data": None,
            "message": DATE_INPUT_INVALID_ERR_MSG,
        }, 400

    data_access = current_app.config["DATA_ACCESS"]()
    user = User(username, data_access)
    timetable = Timetable(user, data_access)

    # attempt to get work times for 7 days from the date specified
    try:
        recorded_times = timetable.work_week(start_date)
    except DataAccessError:
        return {
            "status": "error",
            "data": None,
            "message": DATA_RETRIEVAL_ERR_MSG,
        }, 500

    # turn all date values into strings
    for task_name, task_times in recorded_times.items():
        for task_time in task_times:
            task_time["date"] = str(task_time["date"])

    return {
        "status": "success",
        "data": recorded_times,
        "message": None,
    }, 200


@work_tracking_bp.route("/task/<task_name>", methods=["PATCH"])
@jwt_token_required
@json_data_required
def modify_task(username, task_name):
    data_access = current_app.config["DATA_ACCESS"]()
    user = User(username, data_access)
    timetable = Timetable(user, data_access)

    active = request.get_json().get("active")
    if active is not None:
        try:
            timetable.modify_task(Task(task_name, active, user))
        except ValueError as e:
            return {
                "status": "error",
                "data": None,
                "message": str(e),
            }, 400
        except DataAccessError as e:
            return {
                "status": "error",
                "data": None,
                "message": DATA_RETRIEVAL_ERR_MSG,
            }, 500

    return {
        "status": "success",
        "data": None,
        "message": None,
    }, 200
