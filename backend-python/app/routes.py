from flask import Blueprint, jsonify
from .models import Call
from .models import User

main = Blueprint('main', __name__)

@main.route('/calls')
def get_calls():
    calls = Call.query.all()
    return jsonify([
        {
            "id": c.id_call,
            "date": c.date.strftime("%Y-%m-%d %H:%M:%S"),
            "duration": c.duration,
            "user_id": c.id_user
        } for c in calls
    ])

@main.route('/users')
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "id": u.id_user,
            "name": u.name,
            "email": u.email,
            "role": u.role
        } for u in users
    ])
    
@main.route('/calls/users')
def get_calls_with_users():
    from .models import Call, User
    from . import db

    results = db.session.query(Call, User).join(User, Call.id_user == User.id_user).all()

    response = []
    for call, user in results:
        response.append({
            "id_call": call.id_call,
            "date": call.date.strftime("%Y-%m-%d %H:%M:%S"),
            "duration": call.duration,
            "silence_percentage": call.silence_percentage,
            "id_user": call.id_user,
            "id_client": call.id_client,
            "id_emotions": call.id_emotions,
            "user": {
                "id": user.id_user,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        })

    return jsonify(response)

