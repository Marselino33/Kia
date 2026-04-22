#!/usr/bin/env python3
"""Quick test of mental_health_api after training."""

import subprocess
import time
import requests
import sys
import os


def start_server():
    """Start FastAPI server in background."""
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "mental_health_api:app", "--port", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=os.path.dirname(os.path.abspath(__file__)),
    )
    # Wait for startup
    time.sleep(3)
    return proc


def test_health():
    r = requests.get("http://localhost:8000/health", timeout=5)
    print(f"Health: {r.status_code} - {r.json()}")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "healthy"
    assert data["model_type"] == "3-class-RF"
    print("  OK: model_type is 3-class-RF ✓")


def test_predict_high():
    payload = {
        "q1": 4,
        "q2": 4,
        "q3": 4,
        "q4": 3,
        "q5": 4,
        "q6": 0,
        "q7": 0,
        "q8": 1,
        "q9": 0,
        "q10": 0,
    }
    r = requests.post(
        "http://localhost:8000/api/v1/mental-health/predict", json=payload, timeout=5
    )
    print(f"Predict: {r.status_code}")
    assert r.status_code == 200
    data = r.json()
    print(f"  label: {data['label']} (expected TINGGI)")
    print(f"  skor_total: {data['skor_total']} (expected 38)")
    print(f"  score: {data['score']:.4f}")
    print(f"  is_fallback: {data['is_fallback']}")
    assert data["label"] == "TINGGI"
    assert data["skor_total"] == 38
    assert data["label_binary"] == "stres"
    print("  OK: High stress case correct ✓")


def test_predict_low():
    payload = {
        "q1": 0,
        "q2": 0,
        "q3": 0,
        "q4": 0,
        "q5": 0,
        "q6": 4,
        "q7": 4,
        "q8": 4,
        "q9": 4,
        "q10": 4,
    }
    r = requests.post(
        "http://localhost:8000/api/v1/mental-health/predict", json=payload, timeout=5
    )
    data = r.json()
    print(f"  label: {data['label']} (expected RENDAH)")
    print(f"  skor_total: {data['skor_total']} (should be <=13)")
    assert data["label"] == "RENDAH"
    assert data["skor_total"] <= 13
    print("  OK: Low stress case correct ✓")


if __name__ == "__main__":
    print("=" * 60)
    print("Quick test: Starting server...")
    server = start_server()
    try:
        test_health()
        test_predict_high()
        test_predict_low()
        print("\n" + "=" * 60)
        print("ALL TESTS PASSED ✓")
        print("=" * 60)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        sys.exit(1)
    finally:
        server.terminate()
        server.wait()
