from flask import Flask, jsonify, render_template

import alertfeedStatic as af

app = Flask(__name__)


@app.route("/")
def hello():
    return jsonify({"about": "Hello World!"})


if __name__ == "__main__":
    app.run(debug=True)
