from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

calls = [
    {
        "id": 1,
        "name": "John Doe",
        "date": "2025-03-25",
        "duration": "5:32",
        "agent": "Jose Miguel",
    },
    {
        "id": 2,
        "name": "Jane Smith",
        "date": "2025-03-24",
        "duration": "8:15",
        "agent": "Marco Martinez",
    },
    {
        "id": 3,
        "name": "Bob Johnson",
        "date": "2025-03-23",
        "duration": "12:45",
        "agent": "Gabriel Aguilera",
    },
    {
        "id": 4,
        "name": "Robbie Williams",
        "date": "2025-03-26",
        "duration": "8:45",
        "agent": "Dan Reynolds",
    },
]

@app.route('/calls', methods=['GET'])
def get_calls():
    return jsonify(calls)

if __name__ == '__main__':
    app.run(debug=True)
