import os
import io
import pytest

API_KEY = os.getenv("API_KEY")
HEADERS = {"X-API-KEY": API_KEY}

def test_get_users(client):
    res = client.get("/users", headers=HEADERS)
    assert res.status_code == 200
    assert isinstance(res.json, list)

def test_get_calls(client):
    res = client.get("/calls", headers=HEADERS)
    assert res.status_code == 200

def test_login_invalid(client):
    res = client.post("/login", json={
        "email": "fake@example.com",
        "password": "wrongpass"
    }, headers=HEADERS)
    assert res.status_code == 401

def test_get_calls_with_users(client):
    res = client.get("/calls/users", headers=HEADERS)
    assert res.status_code == 200
    assert isinstance(res.json, list)
    
def test_create_reports_from_calls_empty(client):
    res = client.post("/reports/from-calls", json={"call_ids": []}, headers=HEADERS)
    assert res.status_code == 400

def test_list_reports(client):
    res = client.get("/reports", headers=HEADERS)
    assert res.status_code == 200
    assert isinstance(res.json, list)

def test_delete_report_not_found(client):
    res = client.delete("/reports/999999", headers=HEADERS)
    assert res.status_code == 404
    
def test_create_reports_from_calls_report_already_exists(client):
    # 1. Subir llamada (esto ya crea transcript y reporte)
    mp3_data = io.BytesIO(b"fake mp3 data")
    upload_data = {
        "file": (mp3_data, "test.mp3"),
        "client": "1",
        "agent": "TestAgent",
        "project": "TestProject",
        "date": "2024-01-02",
        "time": "10:00"
    }
    upload = client.post("/upload-call", data=upload_data, content_type="multipart/form-data", headers=HEADERS)
    assert upload.status_code == 201

    call_id = upload.json["call_id"]

    # 2. Tratar de generar reporte de nuevo para esa misma llamada
    res = client.post("/reports/from-calls", json={"call_ids": [call_id]}, headers=HEADERS)
    assert res.status_code == 400 or res.json.get("error") is not None
