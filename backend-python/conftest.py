import os
import pytest
from app import create_app, db

@pytest.fixture
def client(monkeypatch):
    os.environ["API_KEY"] = "123"
    app = create_app(testing=True)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["TESTING"] = True

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()
