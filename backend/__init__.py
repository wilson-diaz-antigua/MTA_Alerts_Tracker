import os

from flask import Flask
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "data.db")


app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["CORS_HEADERS"] = "Content-Type"


db = SQLAlchemy(app)
ma = Marshmallow(app)
