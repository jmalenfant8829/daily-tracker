# url routing for work tracking api

from datetime import date
from flask import Blueprint, request, current_app, jsonify
from tracker_api.data_access.exc import DataAccessError
from tracker_api.user import User
from tracker_api.timetable import Timetable
from tracker_api.helpers import date_keys_to_strings

DATE_INPUT_INVALID_ERR_MSG = "Date input must be numbers representing a valid date"
DATA_RETRIEVAL_ERR_MSG = "Error occurred while attempting to retrieve data"

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
    user = User(username, "placeholder-value", data_access)
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

    data = date_keys_to_strings(recorded_times)

    return {
        "status": "success",
        "data": date_keys_to_strings(recorded_times),
        "message": None,
    }, 200
