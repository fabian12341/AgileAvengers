from app import create_app
from flask_cors import CORS
from app import create_app, db
from app.models import User, Call, Transcript
app = create_app()
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://agileavengers-2.onrender.com"]}}, supports_credentials=True)

if __name__ == '__main__':
    app.run(debug=True)
