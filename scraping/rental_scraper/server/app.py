from flask import Flask, jsonify
from pymongo import MongoClient
from bson import json_util
import json


def parse_json(data):
    return json.loads(json_util.dumps(data))


app = Flask(__name__)
client = MongoClient('mongodb://localhost:27017/')
db = client['one-roof']
collection = db['listings']


@app.route('/listings', methods=['GET'])
def get_rentals():
    rentals = list(collection.find({}))
    return {'rentals': parse_json(rentals)}


if __name__ == '__main__':
    app.run(port=5001)
