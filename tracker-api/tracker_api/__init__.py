from flask import Flask
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from .config import Config

# set app config
load_dotenv()
app = Flask(__name__)
app.config.from_object(Config)

# initialize db
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# avoid circular import
from . import routes, models
