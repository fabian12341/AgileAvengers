from flask import Flask
from .extensions import db
from config import Config
from dotenv import load_dotenv
import os
from .routes import main

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    app.register_blueprint(main)

    return app

