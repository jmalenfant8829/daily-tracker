from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from tracker_api.config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # initialize db
    db.init_app(app)
    migrate.init_app(app, db)

    #from tracker_api import routes
    from tracker_api.data_access import sqlalchemy
    
    return app

