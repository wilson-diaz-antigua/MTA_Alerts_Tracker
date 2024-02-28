from flask import Flask, jsonify, render_template

from backend import app
from backend.models import *

# import alertfeedStatic as af


PlannedChanges.init_app(app)

voyceSchemas = db_Schema(many=True)
voyceSchema = db_Schema()


@app.route("/")
def hello():
    return jsonify({"about": "Hello World!"})


if __name__ == "__main__":
    app.run(debug=True)
