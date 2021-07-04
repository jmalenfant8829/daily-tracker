from dotenv import load_dotenv

load_dotenv()

import os

basedir = os.path.abspath(os.path.dirname(__file__))

# app settings configuration
class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY") or "your-pet's-name"
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    ) or "sqlite:///" + os.path.join(basedir, "app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET") or "your-pet's-name"


class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "TEST_DATABASE_URL"
    ) or "sqlite:///" + os.path.join(basedir, "app.db")
