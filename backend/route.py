import sys

from flask import Flask, jsonify, render_template

# from models import Data
# from route import app

# import alertfeedStatic as af

app = Flask(__name__)


@app.route("/")
def hello():
    return jsonify({"about": "Hello World!"})


if __name__ == "__main__":
    app.run(debug=True)
