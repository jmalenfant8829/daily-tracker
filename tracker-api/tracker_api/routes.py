# url routing for work tracking api

from datetime import date
from flask import Blueprint, current_app, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
    JWTManager,
)
from tracker_api.data_access.exc import DataAccessError
from tracker_api.user import User
from tracker_api.timetable import Timetable
from tracker_api.helpers import date_keys_to_strings

DATE_INPUT_INVALID_ERR_MSG = "Date input must be numbers representing a valid date"
DATA_RETRIEVAL_ERR_MSG = "Error occurred while attempting to retrieve data"
MISSING_JSON_BODY_ERR_MSG = "Must specify JSON request body"

work_tracking_bp = Blueprint("work-tracking", __name__)


@work_tracking_bp.route("/<username>/work-tracking", methods=["PUT"])
def work_tracking():
    data_access = current_app.config["DATA_ACCESS"]()
    return {}


@work_tracking_bp.route(
    "/<username>/work-tracking/<year>/<month>/<day>", methods=["GET"]
)
def work_week(username, year, month, day):
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

    return {
        "status": "success",
        "data": date_keys_to_strings(recorded_times),
        "message": None,
    }, 200


@work_tracking_bp.route("/register", methods=["POST"])
def register():
    """registers a new user given a username and password"""
    # verify required request data was sent
    data = request.get_json()

    if not data:
        return {
            "status": "error",
            "data": None,
            "message": MISSING_JSON_BODY_ERR_MSG,
        }, 400

    username, password = data.get("username"), data.get("password")
    if not username or not password:
        return {
            "status": "error",
            "data": None,
            "message": "Must specify a username and password",
        }, 400

    # add the new user
    try:
        data_access = current_app.config["DATA_ACCESS"]()
        new_user = User(username=username, data_access=data_access)
        new_user.save(password=password)
    except ValueError as e:
        return {
            "status": "error",
            "data": None,
            "message": str(e),
        }, 400

    return {"status": "success", "data": None, "message": None}, 200
