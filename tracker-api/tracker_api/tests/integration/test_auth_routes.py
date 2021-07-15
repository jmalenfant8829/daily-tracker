# tests for signup/token routes for authentication
from faker import Faker

faker = Faker()


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
