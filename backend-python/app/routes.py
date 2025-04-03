from flask import Blueprint, jsonify, request, abort
import os
from .models import Call
from .models import User
from .models import Transcript

main = Blueprint('main', __name__)

def require_api_key():
    api_key = request.headers.get("X-API-KEY")
    if api_key != os.getenv("API_KEY"):
        abort(401, description="API key inválida o ausente")

@main.route('/calls')
def get_calls():
    require_api_key()
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
    require_api_key()
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
    require_api_key()
    from .models import Call
    calls = Call.query.all()

    response = []
    for call in calls:
        user = call.user
        transcript = call.transcript

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
            } if user else None,
            "transcript": {
                "id_transcript": transcript.id_transcript,
                "text": transcript.text,
                "language": transcript.language
            } if transcript else None
        })

    return jsonify(response)

