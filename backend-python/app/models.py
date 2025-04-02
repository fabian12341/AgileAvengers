from . import db

class User(db.Model):
    __tablename__ = 'users'
    id_user = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    role = db.Column(db.String(50))

class Call(db.Model):
    __tablename__ = 'calls'
    id_call = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    duration = db.Column(db.Integer)
    silence_percentage = db.Column(db.Integer)
    id_user = db.Column(db.Integer, db.ForeignKey('users.id_user'))
    id_client = db.Column(db.Integer)
    id_emotions = db.Column(db.Integer)

