from flask import Blueprint, jsonify, request, abort
from mutagen.mp3 import MP3
from sqlalchemy.orm import joinedload, subqueryload
import os
from .models import Call, User, Report, Transcript, Emotions, SpeakerAnalysis, Voice, Suggestion
from . import db
from datetime import datetime
import requests

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
        calls = Call.query.options(
            joinedload(Call.user),
            joinedload(Call.transcript),
            joinedload(Call.report),
        ).all()

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
                "user": {
                    "id": user.id_user,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role
                } if user else None,
                "transcript": {
                    "id_transcript": transcript.id_transcript,
                    "entries": transcript.entries if transcript and transcript.entries else [],
                    "language": transcript.language
                }if transcript else None,
                "report": {
                    "id_report": report.id_report,
                    "summary": report.summary,
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
        print("Enviando a VM...")
        vm_response = requests.post("http://140.84.182.253:5000/analyze-call", files=files, data=data)
        print("📬 Respuesta VM Status:", vm_response.status_code)

        if vm_response.status_code != 200:
            print("Error desde VM:", vm_response.text)
            return jsonify({"error": "Error al procesar con la VM"}), 500

        result = vm_response.json()
        print("Resultado de la VM recibido.")

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
        transcript_text = " ".join([s["text"] for s in result["transcript"]])
        transcript = Transcript(
            id_call=call.id_call,
            text=transcript_text,
            language=language,
            num_speakers=result["num_speakers"]
        )
        db.session.add(transcript)

        # Reporte
        report = Report(
            id_call=call.id_call,
            summary=result["summary"],
            path="no_path"
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
        print("Error en upload-call:", str(e))
        return jsonify({"error": str(e)}), 500

