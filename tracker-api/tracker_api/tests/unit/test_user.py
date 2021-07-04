import pytest
from tracker_api.user import User

# dummy class to avoid needing the database for unit tests
class DataAccessStub:
    pass


def test_fail_create_user_with_blank_username():
    with pytest.raises(ValueError):
        user = User(username="", data_access=DataAccessStub())
