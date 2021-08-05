# tests for signup/token routes for authentication
import pytest
from faker import Faker

faker = Faker()


@pytest.fixture
def registered_user(app, db, cli):
    username, password = "testuser", "testpassword"
    cli.post(
        "/register",
        json={"username": username, "password": password},
    )
    return username, password


@pytest.fixture
def auth_token(app, db, cli, registered_user):
    username, password = registered_user
    res = cli.post(
        "/token",
        json={"username": username, "password": password},
    )

    return res.get_json().get("data").get("token")


def test_register_new_user(app, db, cli):
    """should register a valid new user"""
    profile = faker.profile()
    username = profile["username"]
    res = cli.post(
        "/register",
        json={"username": username, "password": faker.password()},
    )

    assert res.status_code == 200
    data_access = app.config["DATA_ACCESS"]()
    assert data_access.user_by_username(username) != None


def test_fail_register_duplicate_user(app, db, cli):
    """should not register duplicate users"""
    profile = faker.profile()
    username = profile["username"]
    cli.post(
        "/register",
        json={"username": username, "password": faker.password()},
    )

    res = cli.post(
        "/register",
        json={"username": username, "password": faker.password()},
    )

    assert res.status_code == 400


def test_fail_register_blank_username(app, db, cli):
    """should not register with an empty username"""
    res = cli.post(
        "/register",
        json={"username": "", "password": faker.password()},
    )

    assert res.status_code == 400


def test_fail_register_blank_password(app, db, cli):
    """should not register with an empty password"""
    res = cli.post(
        "/register",
        json={"username": "asdf", "password": ""},
    )

    assert res.status_code == 400


def test_fail_register_with_no_request_data(app, db, cli):
    """should not register without providing JSON request body"""
    res = cli.post(
        "/register",
    )

    assert res.status_code == 400


def test_get_auth_token(app, db, cli):
    """
    given existing user
    when asking for an authentication token with valid credentials
    then an authentication token is provided
    """
    username, password = "testuser", "testpassword"
    cli.post(
        "/register",
        json={"username": username, "password": password},
    )

    res = cli.post(
        "/token",
        json={"username": username, "password": password},
    )

    assert res.get_json().get("data").get("token") != None
    assert res.status_code == 200

def test_refresh_auth_token(app, db, cli):
    """
    given existing user and auth token
    when using auth token to refresh token
    then new token  will be received
    """
    username, password = "testuser", "testpassword"
    cli.post(
        "/register",
        json={"username": username, "password": password},
    )

    token = cli.post(
        "/token",
        json={"username": username, "password": password},
    ).get_json().get("data").get("token")

    res = cli.post(
        "/refresh-token",
        headers={"Authorization": "Bearer " + token},
    )

    assert res.get_json().get("data").get("token") != None
    assert res.status_code == 200

def test_fail_get_auth_token_given_wrong_password(app, db, cli):
    """
    given existing user
    when asking for auth token with wrong password
    then the response will not contain an auth token
    """
    username, password = "testuser", "testpassword"
    cli.post(
        "/register",
        json={"username": username, "password": password},
    )

    res = cli.post(
        "/token",
        json={"username": username, "password": "wrongpassword"},
    )

    assert res.get_json().get("data") is None
    assert res.status_code == 401


def test_access_protected_route_with_access_token(app, db, cli, auth_token):
    """
    given a user with a valid access token
    when requesting a route which requires an access token
    the resource will be accessible
    """
    res = cli.get(
        "/work-tracking/2021/4/20",
        headers={"Authorization": "Bearer " + auth_token},
    )
    assert res.status_code == 200
    assert res.get_json().get("status") == "success"


def test_fail_access_protected_route_without_token(app, db, cli, registered_user):
    username, _ = registered_user
    res = cli.get("/work-tracking/2021/4/20")

    assert res.status_code == 401
    assert res.get_json().get("status") == "error"


def test_fail_access_protected_route_with_invalid_token(app, db, cli, registered_user):
    username, _ = registered_user
    res = cli.get(
        "/work-tracking/2021/4/20",
        headers={"Authorization": "Bearer " + "thisisnotavalidtoken"},
    )

    assert res.status_code == 401
    assert res.get_json().get("status") == "error"
