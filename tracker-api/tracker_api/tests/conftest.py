# common fixtures
import pytest
from datetime import date, timedelta
from tracker_api import create_app, db as _db
from tracker_api.config import TestConfig

# flask fixture structure derived from https://diegoquintanav.github.io/flask-contexts.html


@pytest.fixture
def app():
    test_app = create_app(TestConfig)
    context = test_app.app_context()
    context.push()

    yield test_app

    context.pop()


@pytest.fixture
def db(app):
    _db.app = app
    with app.app_context():
        _db.create_all()

    yield db

    _db.session.remove()
    _db.drop_all()


@pytest.fixture
def cli(app):
    return app.test_client()


@pytest.fixture
def work_times():
    day = date(2021, 3, 20)

    work_times = {
        day: {
            "task1": {
                "minutes_spent": 40,
            }
        },
        day
        + timedelta(days=1): {
            "task2": {
                "minutes_spent": 20,
            },
        },
    }

    return work_times


# dummy class to avoid needing the database for unit tests
class DataAccessStub:
    def add_user(self, **kwargs):
        pass

    def commit(self, **kwargs):
        pass

    def record_work_time(self, **kwargs):
        pass

    def work_week(self, **kwargs):
        pass
