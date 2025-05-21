from flask import Blueprint, jsonify, request, abort
from mutagen.mp3 import MP3
from sqlalchemy.orm import joinedload, subqueryload
import os
from .models import Call, User, Report, Transcript, Emotions, SpeakerAnalysis, Voice, Suggestion, PasswordResetCode
from . import db
from datetime import datetime, timedelta, timezone
import requests
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import bcrypt

main = Blueprint('main', __name__)

def require_api_key():
    api_key = request.headers.get("X-API-KEY")
    if api_key != os.getenv("API_KEY"):
        abort(401, description="API key inválida o ausente")

@main.route('/clients')
def get_clients():
    require_api_key()

    from .models import Client
    clients = Client.query.all()
    return jsonify([
        {
            "id_client": c.id_client,
            "name": c.name
        } for c in clients
    ])


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
            "role": u.role,
            "id_team": u.id_team
        } for u in users
    ])

@main.route('/login', methods=['POST'])
def post_login():
    require_api_key()
    
    # Get email and password from the request body
    data = request.get_json()
    print("Request data:", data)  # Log the incoming request data

    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not email or not password:
        print("Missing email or password")
        return jsonify({"error": "Email and password are required"}), 400

    # Fetch user from the database by email
    user = User.query.filter_by(email=email).first()
    print("User fetched from DB:", user)  # Log the user fetched from the database

    if user:
        print("Password hash from DB:", user.password)  # Log the hashed password
    else:
        print(f"User with email {email} not found in the database")
    
    # Check if user exists and password is correct
    if not user:
        print(f"User with email {email} not found in the database")
        return jsonify({"error": "Invalid email or password"}), 401
    
    try:
        print(f"Plain-text password entered by user: {password}")
        print(f"Hashed password from database: {user.password}")
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            print(f"Password verification failed for user {email}")
            return jsonify({"error": "Invalid email or password"}), 401
        else:
            print(f"Password verification successful for user {email}")
    except Exception as e:
        print(f"Error during password verification for user {email}: {str(e)}")
        return jsonify({"error": "An error occurred during login"}), 500
    
    # If credentials are valid, return a success response
    print("Login successful for user:", user.email)  # Log successful login
    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id_user,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "id_team": user.id_team,
        }
    }), 200
    
@main.route('/calls/users')
def get_calls_with_users():
    require_api_key()
    try:
        calls = Call.query.options(
            joinedload(Call.user),
            joinedload(Call.client),
            joinedload(Call.transcript),
            joinedload(Call.report),
        ).all()

        from urllib.parse import urlparse

        # Preload todas las sugerencias y emociones en un solo query
        all_reports = [c.report for c in calls if c.report]
        report_ids = [r.id_report for r in all_reports]
        suggestions_by_report = {}
        if report_ids:
            suggestions = Suggestion.query.filter(Suggestion.id_report.in_(report_ids)).all()
            for s in suggestions:
                suggestions_by_report.setdefault(s.id_report, []).append(s.suggestion)

        speaker_analyses = SpeakerAnalysis.query.filter(
            SpeakerAnalysis.id_call.in_([c.id_call for c in calls])
        ).all()

        voices = Voice.query.filter(
            Voice.id_speaker_analysis.in_([s.id_speaker_analysis for s in speaker_analyses])
        ).all()
        voices_by_speaker = {v.id_speaker_analysis: v for v in voices}

        emotion_ids = list(filter(None, [s.id_emotions for s in speaker_analyses] + [c.id_emotions for c in calls]))
        emotions = Emotions.query.filter(Emotions.id_emotions.in_(emotion_ids)).all()
        emotions_map = {e.id_emotions: e for e in emotions}

        speakers_by_call = {}
        for s in speaker_analyses:
            speakers_by_call.setdefault(s.id_call, []).append(s)

        response = []

        for call in calls:
            user = call.user
            transcript = call.transcript
            report = call.report
            general_emotions = emotions_map.get(call.id_emotions)

            # Obtener la ruta del reporte si existe
            report_path = report.path if report and hasattr(report, "path") else None

            # Firmar el archivo con Supabase si no tiene token
            signed_url = report_path
            if report_path and not report_path.startswith("http"):
                try:
                    r = requests.get(
                        f"http://140.84.182.253:5000/get_report?file_path={report_path}"
                    )
                    signed_url = r.json().get("url", {}).get("signedURL") or report_path
                    print("✅ URL firmada:", signed_url)
                except Exception as e:
                    print("❌ Error al firmar la URL:", e)
            speaker_data = []
            for speaker in speakers_by_call.get(call.id_call, []):
                emotion = emotions_map.get(speaker.id_emotions)
                voice = voices_by_speaker.get(speaker.id_speaker_analysis)
                speaker_data.append({
                    "role": speaker.role,
                    "emotions": {
                        "happiness": emotion.happiness if emotion else None,
                        "sadness": emotion.sadness if emotion else None,
                        "anger": emotion.anger if emotion else None,
                        "neutrality": emotion.neutrality if emotion else None,
                        "text_sentiment": emotion.text_sentiment if emotion else None,
                        "text_sentiment_score": emotion.text_sentiment_score if emotion else None
                    },
                    "voice": {
                        "pitch": voice.pitch if voice else None,
                        "pitch_std_dev": voice.pitch_std_dev if voice else None,
                        "loudness": voice.loudness if voice else None,
                        "zcr": voice.zcr if voice else None,
                        "hnr": voice.hnr if voice else None,
                        "tempo": voice.tempo if voice else None
                    }
                })

            response.append({
                "id_call": call.id_call,
                "date": call.date.strftime("%Y-%m-%d %H:%M:%S"),
                "duration": call.duration,
                "silence_percentage": call.silence_percentage,
                "id_user": call.id_user,
                "id_client": call.id_client,
                "id_emotions": call.id_emotions,
                "client_name": call.client.name if call.client else "Cliente",
                "user": {
                    "id": user.id_user,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "id_team": user.id_team
                } if user else None,
                "transcript": {
                    "id_transcript": transcript.id_transcript,
                    "text": transcript.text,
                    "language": transcript.language
                } if transcript else None,
                "report": {
                    "id_report": report.id_report,
                    "summary": report.summary,
                    "path": signed_url or report.path,
                    "overall_emotion": general_emotions.overall_sentiment_score if general_emotions else None,
                    "suggestions": suggestions_by_report.get(report.id_report, []),
                    "speakers": speaker_data
                } if report else None
            })

        return jsonify(response)

    except Exception as e:
        import traceback
        traceback.print_exc()
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
        language = request.form.get("language")

        print("Form received:", client, agent, project, date_str, time_str)

        if not all([file, client, agent, date_str, time_str]):
            print("Missing fields")
            return jsonify({"error": "Faltan campos obligatorios"}), 400

        user = User.query.filter_by(name=agent).first()
        if not user:
            print("Agente no existe:", agent)
            return jsonify({"error": "El agenSte no existe"}), 404

        datetime_str = f"{date_str} {time_str}:00"
        print("🕒 Datetime:", datetime_str)

        # Enviar a VM
        files = {
            "audio": (file.filename, file.stream, file.mimetype)
        }
        data = {
            "client": client,
            "agent": agent,
            "language": language,
            "num_speakers": 2,
            "datetime": datetime_str
        }
        vm_response = requests.post("http://140.84.182.253:5000/analyze-call", files=files, data=data)

        if vm_response.status_code != 200:
            return jsonify({"error": "Error al procesar con la VM"}), 500

        result = vm_response.json()

        def map_emotions(e):
            return {
                "happiness": e.get("hap"),
                "sadness": e.get("sad"),
                "anger": e.get("ang"),
                "neutrality": e.get("neu"),
            }

        # Insertar emociones
        emotions_overall = Emotions(
            **map_emotions(result["emotions"]["original"]),
            text_sentiment=result["text_emotion"]["original"]["sentiment"],
            text_sentiment_score=result["text_emotion"]["original"]["score"],
            overall_sentiment_score=result["overall_emotion"]
        )
        emotions_agent = Emotions(
            **map_emotions(result["emotions"]["AGENT"]),
            text_sentiment=result["text_emotion"]["AGENT"]["sentiment"],
            text_sentiment_score=result["text_emotion"]["AGENT"]["score"]
        )
        emotions_client = Emotions(
            **map_emotions(result["emotions"]["CLIENT"]),
            text_sentiment=result["text_emotion"]["CLIENT"]["sentiment"],
            text_sentiment_score=result["text_emotion"]["CLIENT"]["score"]
        )
        db.session.add_all([emotions_overall, emotions_agent, emotions_client])
        db.session.flush()

        # Crear llamada
        call = Call(
            date=datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S"),
            duration=int(result["call_duration"]),
            silence_percentage=result["silence_percentage"],
            id_user=user.id_user,
            id_client=int(client) if client.isdigit() else 1,
            id_emotions=emotions_overall.id_emotions
        )
        db.session.add(call)
        db.session.flush()
        print("Llamada creada con ID:", call.id_call)

        # Speaker analysis
        speaker_agent = SpeakerAnalysis(role="Agent", id_call=call.id_call, id_emotions=emotions_agent.id_emotions)
        speaker_client = SpeakerAnalysis(role="Client", id_call=call.id_call, id_emotions=emotions_client.id_emotions)
        db.session.add_all([speaker_agent, speaker_client])
        db.session.flush()

        # Voice features
        voice_agent = result["voice_features"]["AGENT"]
        voice_client = result["voice_features"]["CLIENT"]
        voice1 = Voice(**{
            "pitch": voice_agent["Pitch Mean"],
            "pitch_std_dev": voice_agent["Pitch Std Dev"],
            "loudness": voice_agent["Loudness (RMS Energy)"],
            "zcr": voice_agent["Zero-Crossing Rate"],
            "hnr": voice_agent["Harmonics-to-Noise Ratio"],
            "tempo": voice_agent["Tempo (BPM)"],
            "id_speaker_analysis": speaker_agent.id_speaker_analysis
        })
        voice2 = Voice(**{
            "pitch": voice_client["Pitch Mean"],
            "pitch_std_dev": voice_client["Pitch Std Dev"],
            "loudness": voice_client["Loudness (RMS Energy)"],
            "zcr": voice_client["Zero-Crossing Rate"],
            "hnr": voice_client["Harmonics-to-Noise Ratio"],
            "tempo": voice_client["Tempo (BPM)"],
            "id_speaker_analysis": speaker_client.id_speaker_analysis
        })
        db.session.add_all([voice1, voice2])

        # Transcripción
        transcript_text = "\n\n".join([f'{s["speaker"]}:\n {s["text"]}' for s in result["transcript"]])
        transcript = Transcript(
            id_call=call.id_call,
            text=transcript_text,
            language=language,
            num_speakers=result["num_speakers"]
        )
        db.session.add(transcript)

        # Reporte
        report_path = result.get("report_path")
        print("🔥 Valor original de report_path:", report_path)

        # Firmar la URL del PDF si no está firmada
        signed_url = report_path
        if report_path and not report_path.startswith("http"):
            try:
                r = requests.get(
                    f"http://140.84.182.253:5000/get_report?file_path={report_path}"
                )
                signed_url = r.json().get("url", {}).get("signedURL") or report_path
                print("✅ URL firmada en upload-call:", signed_url)
            except Exception as e:
                print("❌ Error al firmar la URL del reporte en upload-call:", e)



        # Reporte
        report = Report(
            id_call=call.id_call,
            summary=result["summary"],
            path=signed_url,
        )
        db.session.add(report)
        db.session.flush()


        # Sugerencias
        for s in result["suggestions"]:
            for _, value in s.items():
                db.session.add(Suggestion(suggestion=value, id_report=report.id_report))

        db.session.commit()
        print("Llamada y análisis guardados correctamente.")

        return jsonify({
            "message": "Llamada y análisis guardados correctamente",
            "id_call": call.id_call,
            "id_report": report.id_report
        }), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        db.session.rollback()
        print("🔥 Error en upload-call:", str(e))
        return jsonify({"error": str(e)}), 500

@main.route('/calls/<int:call_id>', methods=['DELETE'])
def delete_call(call_id):
    require_api_key()

    call = Call.query.get(call_id)
    if not call:
        return jsonify({"error": "Call not found"}), 404

    # Eliminar Transcript
    if call.transcript:
        db.session.delete(call.transcript)

    # Eliminar Report y sus Suggestions
    if call.report:
        suggestions = Suggestion.query.filter_by(id_report=call.report.id_report).all()
        for s in suggestions:
            db.session.delete(s)
        db.session.delete(call.report)

    # Eliminar SpeakerAnalysis y Voices
    speakers = SpeakerAnalysis.query.filter_by(id_call=call.id_call).all()
    for s in speakers:
        voice = Voice.query.filter_by(id_speaker_analysis=s.id_speaker_analysis).first()
        if voice:
            db.session.delete(voice)
        if s.id_emotions:
            emo = Emotions.query.get(s.id_emotions)
            if emo:
                db.session.delete(emo)
        db.session.delete(s)

    # Emotions generales de la llamada
    if call.id_emotions:
        emo = Emotions.query.get(call.id_emotions)
        if emo:
            db.session.delete(emo)

    # Finalmente, borrar la llamada
    db.session.delete(call)
    db.session.commit()

    return jsonify({"message": "Call and related data deleted"}), 200

@main.route('/User/<int:id_user>', methods=['GET'])
def get_user_dashboard(id_user):
    require_api_key()

    user = User.query.get(id_user)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    calls = Call.query.filter_by(id_user=id_user).all()
    call_ids = [c.id_call for c in calls]

    # Obtener reports relacionados
    reports = Report.query.filter(Report.id_call.in_(call_ids)).all()
    report_map = {r.id_call: r for r in reports}

    # Obtener speaker analysis
    speaker_analysis = SpeakerAnalysis.query.filter(
        SpeakerAnalysis.id_call.in_(call_ids)
    ).all()

    # Obtener solo las emociones relevantes
    emotion_ids = list(filter(None, [s.id_emotions for s in speaker_analysis]))
    emotions = Emotions.query.filter(Emotions.id_emotions.in_(emotion_ids)).all()
    emo_map = {e.id_emotions: e for e in emotions}

    # Construir respuesta de llamadas
    response_calls = []
    for call in calls:
        report = report_map.get(call.id_call)
        speakers = []
        for sa in speaker_analysis:
            if sa.id_call == call.id_call and sa.role == "Agent":
                emo = emo_map.get(sa.id_emotions)
                if emo:
                    speakers.append({
                        "emotions": {
                            "happiness": emo.happiness,
                            "sadness": emo.sadness,
                            "anger": emo.anger
                        }
                    })
        response_calls.append({
            "id_call": call.id_call,
            "duration": call.duration,
            "silence_percentage": call.silence_percentage,
            "date": call.date.strftime("%Y-%m-%d") if call.date else None,
            "report": {
                "id_report": report.id_report if report else None,
                "summary": report.summary if report else "",
                "speakers": speakers
            } if report else None
        })

    return jsonify({
        "user": {
            "id": user.id_user,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "id_team": user.id_team
        },
        "calls": response_calls,
        "reports": []  # puedes rellenarlo si lo necesitas después
    })
    
# Ruta para enviar el correo de verificacion al olvidar contraseña
@main.route('/send-email', methods=['POST'])
def send_email():
    require_api_key()

    data = request.json
    receiver_email = data.get("receiver_email")
    
    SENDER_EMAIL = os.getenv("SENDER_EMAIL")
    SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
    
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        return jsonify({"error": "Missing sender email or password"}), 500

    if not receiver_email:
        return jsonify({"error": "Missing 'receiver_email'"}), 400

    user = User.query.filter_by(email=receiver_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Codigo de verificación
    code = str(random.randint(100000, 999999))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    # Guardar el codigo en la base de datos
    reset_code = PasswordResetCode(id_user=user.id_user, code=code, expires_at=expires_at)
    db.session.add(reset_code)
    db.session.commit()

    # Contenido del correo
    subject = "Verification Code from Shield AI"
    body = f"Hello, your verification code is {code}. It expires in 10 minutes."

    message = MIMEMultipart()
    message["From"] = SENDER_EMAIL
    message["To"] = receiver_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(message)
        return jsonify({"message": "Email sent successfully."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
# Ruta para verificar el codigo de verificacion
@main.route('/verify-code', methods=['POST'])
def verify_code():
    require_api_key()

    data = request.json
    receiver_email = data.get("receiver_email")
    input_code = data.get("code")

    if not receiver_email or not input_code:
        return jsonify({"error": "Missing 'receiver_email' or 'code'"}), 400

    user = User.query.filter_by(email=receiver_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Buscando el código en la base de datos
    reset_code = PasswordResetCode.query.filter_by(id_user=user.id_user, code=input_code).first()
    if not reset_code:
        return jsonify({"error": "Invalid code"}), 400

    current_time = datetime.now(timezone.utc)
       
    expires_at = reset_code.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)  # Assume UTC if naive
    if expires_at < current_time:
        return jsonify({"error": "Code expired"}), 400

    # Borrar el codigo de la BD despues de verificar
    db.session.delete(reset_code)
    db.session.commit()

    return jsonify({"message": "Code verified successfully."})

    
