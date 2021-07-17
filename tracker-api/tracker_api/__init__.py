from flask import Flask
from flask.json import JSONEncoder
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import date
from tracker_api.config import Config
from tracker_api.routes.work_tracking import work_tracking_bp
from tracker_api.routes.auth import auth_bp
from tracker_api.error_handling import register_error_handlers

db = SQLAlchemy()
migrate = Migrate()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # initialize db
    db.init_app(app)
    migrate.init_app(app, db)

    # set data access to sqlalchemy orm
    from tracker_api.data_access import sqlalchemy
    from tracker_api.data_access.data_access import SQLAlchemyDataAccess

    app.config["DATA_ACCESS"] = SQLAlchemyDataAccess

    # set routes
    app.register_blueprint(work_tracking_bp)
    app.register_blueprint(auth_bp)
    register_error_handlers(app)

    return app
