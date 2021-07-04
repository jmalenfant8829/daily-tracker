# tests for login/signup/jwt token routes for authentication
from faker import Faker

faker = Faker()


def test_register_new_user(app, db, cli):
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
    res = cli.post(
        "/register",
        json={"username": "", "password": faker.password()},
    )

    assert res.status_code == 400


def test_fail_register_blank_password(app, db, cli):
    res = cli.post(
        "/register",
        json={"username": "asdf", "password": ""},
    )

    assert res.status_code == 400
