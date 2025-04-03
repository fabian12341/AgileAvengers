from . import db

class User(db.Model):
    __tablename__ = 'users'
    id_user = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    role = db.Column(db.String(50))

    calls = db.relationship('Call', backref='user', lazy=True)


class Call(db.Model):
    __tablename__ = 'calls'
    id_call = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    duration = db.Column(db.Integer)
    silence_percentage = db.Column(db.Integer)
    id_user = db.Column(db.Integer, db.ForeignKey('users.id_user'))
    id_client = db.Column(db.Integer)
    id_emotions = db.Column(db.Integer)

    transcript = db.relationship('Transcript', uselist=False, backref='call', lazy=True)


class Transcript(db.Model):
    __tablename__ = 'transcripts'
    id_transcript = db.Column(db.Integer, primary_key=True)
    id_call = db.Column(db.Integer, db.ForeignKey('calls.id_call'))
    text = db.Column(db.Text)
    language = db.Column(db.String(10))
