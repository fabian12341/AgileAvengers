from . import db

class User(db.Model):
    __tablename__ = 'Users'
    id_user = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    role = db.Column(db.String(50))

    calls = db.relationship('Call', backref='user', lazy=True)


class Call(db.Model):
    __tablename__ = 'Calls'
    id_call = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    duration = db.Column(db.Integer)
    silence_percentage = db.Column(db.Integer)
    id_user = db.Column(db.Integer, db.ForeignKey('Users.id_user'))
    id_client = db.Column(db.Integer)
    id_emotions = db.Column(db.Integer)

    transcript = db.relationship('Transcript', uselist=False, backref='call', lazy=True)
    report = db.relationship("Report", back_populates="call", uselist=False)



class Transcript(db.Model):
    __tablename__ = 'Transcripts'
    id_transcript = db.Column(db.Integer, primary_key=True)
    id_call = db.Column(db.Integer, db.ForeignKey('Calls.id_call'))
    text = db.Column(db.Text)
    language = db.Column(db.String(10))

class Report(db.Model):
    __tablename__ = 'Reports'  # Asegúrate que el nombre coincida con tu BD (con mayúscula inicial)
    id_report = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(255))
    summary = db.Column(db.Text)
    id_call = db.Column(db.Integer, db.ForeignKey('Calls.id_call'))
    call = db.relationship("Call", back_populates="report")
    report_id = db.Column(db.Integer, db.ForeignKey("Reports.id_report"), nullable=True)


