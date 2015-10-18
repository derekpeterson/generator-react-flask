from flask import Flask, render_template
from flask_restful import reqparse, Resource, Api
import json

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
