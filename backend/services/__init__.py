import logging

from config import Config
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlmodel import SQLModel

server = Flask(__name__)
CORS(server)
server.config.from_object(Config)

db = SQLAlchemy(server)
migrate = Migrate(server, db)


from services import flask_route, models

# Setup console logging
if not server.debug:
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.INFO)
    server.logger.addHandler(stream_handler)

server.logger.setLevel(logging.INFO)
server.logger.info("Flask App startup")
