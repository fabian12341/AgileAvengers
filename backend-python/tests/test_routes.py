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
    
