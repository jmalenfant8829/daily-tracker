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
def work_times():
    day = date(2021, 3, 20)

    work_times = [
        {
            "task": "task1",
            "day": day,
            "time_spent": 40,
        },
        {
            "task": "task2",
            "day": day + timedelta(days=1),
            "time_spent": 20,
        },
    ]
    return work_times