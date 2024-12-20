from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_smorest import Api
from flask_sqlalchemy import SQLAlchemy
from services.database import APIConfig, Config
from services.flask_route import stops

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config.from_object(APIConfig)
    CORS(app)

    migrate = Migrate(app, db)
    api = Api(app)
    api.register_blueprint(stops)
    return app, api
