from flask import Flask
from .extensions import db
from config import Config
from dotenv import load_dotenv
import os
from .routes import main
from flask_cors import CORS
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

def create_app(testing=False):
    app = Flask(__name__)
    
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

    if testing:
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        app.config["TESTING"] = True
    else:
        app.config.from_object(Config)

    db.init_app(app)
    app.register_blueprint(main)

    return app
