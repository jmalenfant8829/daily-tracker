from flask import Blueprint, request, current_app
from functools import wraps

from tracker_api.user import User
from .err_msgs import *

auth_bp = Blueprint("auth", __name__)

def json_data_required(f):
    """route decorator requiring json data in request body"""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.get_json():
            return {
                "status": "error",
                "data": None,
                "message": MISSING_JSON_BODY_ERR_MSG,
            }, 400
        return f(*args, **kwargs)

    return decorated_function


def jwt_token_required(f):
    """route decorator requiring a valid auth token"""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        token = None

        if auth_header:
            try:
                token = auth_header.split()[1]
            except IndexError:
                pass

        if token:
            username = User.verify_auth_token(
                token, current_app.config.get("SECRET_KEY")
            )
            if not username:
                return {
                    "status": "error",
                    "data": None,
                    "message": MISSING_TOKEN_ERR_MSG,
                }, 401
        else:
            return {
                "status": "error",
                "data": None,
                "message": INVALID_TOKEN_ERR_MSG,
            }, 401

        kwargs["username"] = username
        return f(*args, **kwargs)

    return decorated_function


@auth_bp.route("/token", methods=["POST"])
@json_data_required
def token():
    data = request.get_json()

    username, password = data.get("username"), data.get("password")
    if not username or not password:
        return {
            "status": "error",
            "data": None,
            "message": MISSING_USERNAME_AND_PASSWORD_ERR_MSG,
        }, 400

    try:
        user = User(username, current_app.config["DATA_ACCESS"]())
        password_correct = user.password_correct(password)

        if password_correct:
            token = user.generate_auth_token(current_app.config["SECRET_KEY"])
            return {
                "status": "success",
                "data": {"token": token},
                "message": None,
            }, 200
        else:
            return {
                "status": "error",
                "data": None,
                "message": INVALID_CREDENTIALS_ERR_MSG,
            }, 401
    except ValueError as e:
        return {
            "status": "error",
            "data": None,
            "message": str(e),
        }, 400


@auth_bp.route("/register", methods=["POST"])
@json_data_required
def register():
    """registers a new user given a username and password"""
    # verify required request data was sent
    data = request.get_json()

    username, password = data.get("username"), data.get("password")
    if not username or not password:
        return {
            "status": "error",
            "data": None,
            "message": MISSING_USERNAME_AND_PASSWORD_ERR_MSG,
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
