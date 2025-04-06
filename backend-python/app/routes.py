from flask import Blueprint, jsonify, request, abort
import os
from .models import Call, User, Report
from . import db

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
    try:
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

    except Exception as e:
        print("🔥 Error en /calls/users:", str(e))
        return jsonify({"error": "Error interno en /calls/users"}), 500


@main.route('/reports/from-calls', methods=['POST'])
def create_report_from_calls():
    try:
        data = request.get_json()
        print("Datos recibidos:", data)

        call_ids = data.get("call_ids")
        if not call_ids or not isinstance(call_ids, list):
            return jsonify({"error": "Debes enviar una lista de call_ids"}), 400

        calls = Call.query.filter(Call.id_call.in_(call_ids)).all()
        print("Llamadas encontradas:", [call.id_call for call in calls])

        texts = []
        for call in calls:
            print(f"Transcript para llamada {call.id_call}:", call.transcript)
            if call.transcript and call.transcript.text:
                texts.append(call.transcript.text)

        if not texts:
            return jsonify({"error": "Ninguna llamada tiene transcript"}), 400

        full_text = " ".join(texts)
        sentences = full_text.split(".")
        summary = ". ".join(sentences[:3]).strip() + "."

        report = Report(summary=summary)
        db.session.add(report)
        db.session.flush()

        for call in calls:
            call.report_id = report.id_report

        db.session.commit()

        return jsonify({
            "message": "Reporte creado exitosamente",
            "id_report": report.id_report,
            "summary": summary
        }), 201

    except Exception as e:
        print("🔥 Error inesperado:", str(e))
        return jsonify({"error": "Error interno del servidor"}), 500



