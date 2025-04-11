from flask import Blueprint, jsonify, request, abort
from werkzeug.security import check_password_hash
from mutagen.mp3 import MP3
from werkzeug.utils import secure_filename
import os
from .models import Call, User, Report, Transcript
from . import db
from datetime import datetime
import tempfile

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

@main.route('/login', methods=['POST'])
def post_login():
    require_api_key()
    
    # Get email and password from the request body
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Fetch user from the database by email
    user = User.query.filter_by(email=email).first()

    # Check if user exists and password is correct
    if not user or user.password != password:
        return jsonify({"error": "Invalid email or password route error", }), 401

    # If credentials are valid, return a success response
    return jsonify({
        "message": "Login successful",
        "user": {
            "email": user.email,
            "role": user.role
        }
    }), 200

@main.route('/calls/users')
def get_calls_with_users():
    require_api_key()
    try:
        calls = Call.query.all()

        response = []
        for call in calls:
            user = call.user
            transcript = call.transcript
            report = call.report  # gracias a uselist=False, esto es un objeto, no lista

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
                } if transcript else None,
                "report": {
                    "id_report": report.id_report,
                    "summary": report.summary
                } if report else None
            })

        return jsonify(response)

    except Exception as e:
        print("🔥 Error en /calls/users:", str(e))
        return jsonify({"error": "Error interno en /calls/users"}), 500



@main.route('/reports/from-calls', methods=['POST'])
def create_reports_from_calls():
    try:
        data = request.get_json()

        call_ids = data.get("call_ids")
        if not call_ids or not isinstance(call_ids, list):
            return jsonify({"error": "Debes enviar una lista de call_ids"}), 400

        calls = Call.query.filter(Call.id_call.in_(call_ids)).all()

        if len(calls) != len(call_ids):
            return jsonify({"error": "Una o más llamadas no existen"}), 404

        created_reports = []

        for call in calls:

            # Verifica si ya hay un reporte creado para esta llamada
            existing = Report.query.filter_by(id_call=call.id_call).first()
            if existing:
                continue

            if call.transcript and call.transcript.text:
                text = call.transcript.text
                sentences = text.split(".")
                summary = ". ".join(sentences[:3]).strip() + "."

                report = Report(summary=summary, id_call=call.id_call)
                db.session.add(report)
                db.session.flush()

                created_reports.append({
                    "id_report": report.id_report,
                    "summary": summary,
                    "id_call": call.id_call
                })
            else:
                print(f"Llamada {call.id_call} no tiene transcript")

        if not created_reports:
            return jsonify({"error": "Ninguna llamada tenía transcript o ya tiene reporte"}), 400

        db.session.commit()

        return jsonify({
            "message": "Reportes generados exitosamente",
            "reports": created_reports
        }), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        print("🔥 Error al generar reportes:", str(e))
        return jsonify({"error": "Error interno del servidor"}), 500

@main.route('/reports', methods=['GET'])
def list_reports():
    reports = Report.query.all()
    return jsonify([
        {
            "id_report": r.id_report,
            "summary": r.summary,
            "call": {
                "id_call": r.call.id_call,
                "date": r.call.date.strftime("%Y-%m-%d"),
                "client": r.call.id_client,
                "agent": r.call.user.name if r.call.user else "Desconocido"
            } if r.call else None
        } for r in reports
    ])

@main.route('/reports/<int:report_id>', methods=['DELETE'])
def delete_report(report_id):
    require_api_key()
    report = Report.query.get(report_id)
    if not report:
        return jsonify({"error": "Reporte no encontrado"}), 404

    db.session.delete(report)
    db.session.commit()
    return jsonify({"message": "Reporte eliminado correctamente"}), 200

@main.route('/upload-call', methods=['POST'])
def upload_call():
    try:
        require_api_key()
        file = request.files.get("file")
        client = request.form.get("client")
        agent = request.form.get("agent")
        project = request.form.get("project")
        date_str = request.form.get("date")
        time_str = request.form.get("time")

        if not all([file, client, agent, date_str, time_str]):
            return jsonify({"error": "Faltan campos obligatorios"}), 400

        # 🔍 Obtener duración real del archivo mp3
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            filename = secure_filename(file.filename)
            tmp.write(file.read())
            tmp.flush()
            audio = MP3(tmp.name)
            duration_seconds = int(audio.info.length)

        # 🕒 Convertir fecha y hora
        datetime_str = f"{date_str} {time_str}:00"
        date_obj = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S")

        # 👤 Buscar o crear user
        user = User.query.filter_by(name=agent).first()
        if not user:
            user = User(name=agent, email=f"{agent.lower()}@example.com", role="Agent")
            db.session.add(user)
            db.session.flush()

        # 📞 Crear llamada
        call = Call(
            date=date_obj,
            duration=duration_seconds,
            silence_percentage=10,
            id_user=user.id_user,
            id_client=int(client) if client.isdigit() else 1,
            id_emotions=1
        )
        db.session.add(call)
        db.session.flush()

        # 📝 Crear transcript
        transcript = Transcript(
            id_call=call.id_call,
            text="Esto es una transcripción de prueba generada automáticamente.",
            language="es",
            num_speakers=1
        )
        db.session.add(transcript)

        # 📄 Crear reporte
        summary = transcript.text.split(".")[0].strip() + "."
        report = Report(id_call=call.id_call, summary=summary)
        db.session.add(report)

        db.session.commit()

        return jsonify({
            "message": "Llamada, transcript y reporte creados exitosamente",
            "call_id": call.id_call,
            "duration_seconds": duration_seconds,
            "report_summary": summary
        }), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

