import pytest
from tracker_api.user import User
from tracker_api.tests.conftest import DataAccessStub


def test_fail_create_user_with_blank_username():
    with pytest.raises(ValueError):
        user = User(username="", data_access=DataAccessStub())


def test_fail_save_user_with_blank_password():
    user = User(username="asdf", data_access=DataAccessStub())
    with pytest.raises(ValueError):
        user.save(password="")


def test_fail_save_user_with_short_password():
    user = User(username="asdf", data_access=DataAccessStub())
    with pytest.raises(ValueError):
        user.save(password="2tiny")


def test_save_user_with_minimum_len_password():
    user = User(username="asdf", data_access=DataAccessStub())
    user.save(password="8chrpass")


# test hashing/verifying
# password len/reqs
