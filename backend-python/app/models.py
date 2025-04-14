from . import db

class User(db.Model):
    __tablename__ = 'Users'
    id_user = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    role = db.Column(db.String(50))
    password = db.Column(db.String(100))

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
    report = db.relationship('Report', uselist=False, backref='call', lazy=True)


class Transcript(db.Model):
    __tablename__ = 'Transcripts'
    id_transcript = db.Column(db.Integer, primary_key=True)
    id_call = db.Column(db.Integer, db.ForeignKey('Calls.id_call'))
    text = db.Column(db.Text)
    language = db.Column(db.String(10))
    num_speakers = db.Column(db.Integer)


class Report(db.Model):
    __tablename__ = 'Reports'
    id_report = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(255), default="no_path")
    summary = db.Column(db.Text)
    id_call = db.Column(db.Integer, db.ForeignKey('Calls.id_call'), unique=True)

class Emotions(db.Model):
    __tablename__ = 'Emotions'
    id_emotions = db.Column(db.Integer, primary_key=True)
    happiness = db.Column(db.Float)
    sadness = db.Column(db.Float)
    anger = db.Column(db.Float)
    neutrality = db.Column(db.Float)
    text_sentiment = db.Column(db.Enum('positive', 'negative', 'neutral'))
    text_sentiment_score = db.Column(db.Float)
    overall_sentiment_score = db.Column(db.Float)


class SpeakerAnalysis(db.Model):
    __tablename__ = 'Speaker_Analysis'
    id_speaker_analysis = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.Enum('Agent', 'Client'), nullable=False)
    id_call = db.Column(db.Integer, db.ForeignKey('Calls.id_call'))
    id_emotions = db.Column(db.Integer, db.ForeignKey('Emotions.id_emotions'))


class Voice(db.Model):
    __tablename__ = 'Voice'
    id_voice = db.Column(db.Integer, primary_key=True)
    pitch = db.Column(db.Float)
    pitch_std_dev = db.Column(db.Float)
    loudness = db.Column(db.Float)
    zcr = db.Column(db.Float)
    hnr = db.Column(db.Float)
    tempo = db.Column(db.Float)
    id_speaker_analysis = db.Column(db.Integer, db.ForeignKey('Speaker_Analysis.id_speaker_analysis'))


class Suggestion(db.Model):
    __tablename__ = 'Suggestions'
    id_suggestion = db.Column(db.Integer, primary_key=True)
    suggestion = db.Column(db.String(255), nullable=False)
    id_report = db.Column(db.Integer, db.ForeignKey('Reports.id_report'))


class KeyWord(db.Model):
    __tablename__ = 'Key_Words'
    id_word = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(255), nullable=False)
    id_report = db.Column(db.Integer, db.ForeignKey('Reports.id_report'))

