#!/usr/bin/env python3
"""
Integration test script for Mental Health API v2.
Tests: health check, prediction, response schema, score ranges.
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8000"


def test_health():
    print("🔍 Testing GET /health ...")
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=5)
        data = r.json()
        assert r.status_code == 200, f"Status {r.status_code}"
        assert data.get("status") == "healthy"
        assert (
            data.get("model_type") == "3-class-RF"
            or data.get("model_type") == "binary-logistic"
        )
        print(
            f"   ✅ Health OK: model_version={data.get('model_version')}, type={data.get('model_type')}"
        )
        return True
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")
        return False


def test_prediction_high_stress():
    print("\n🔍 Testing POST /api/v1/mental-health/predict (high stress case)...")
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
    try:
        r = requests.post(
            f"{BASE_URL}/api/v1/mental-health/predict", json=payload, timeout=10
        )
        data = r.json()
        assert r.status_code == 200, f"Status {r.status_code}"

        # Validate schema
        required_fields = [
            "label",
            "label_binary",
            "score",
            "skor_total",
            "advice",
            "is_fallback",
            "probabilities",
            "model_version",
        ]
        for f in required_fields:
            assert f in data, f"Missing field: {f}"

        # Validate types
        assert data["label"] in ["RENDAH", "SEDANG", "TINGGI"], (
            f"Invalid label: {data['label']}"
        )
        assert data["label_binary"] in ["tidak", "stres"], (
            f"Invalid binary: {data['label_binary']}"
        )
        assert 0 <= data["score"] <= 1, f"Score out of range: {data['score']}"
        assert data["skor_total"] in range(0, 41), (
            f"Skor out of range: {data['skor_total']}"
        )
        assert isinstance(data["is_fallback"], bool)
        assert isinstance(data["probabilities"], dict)
        assert all(0 <= v <= 1 for v in data["probabilities"].values())

        print(f"   ✅ Prediction OK")
        print(f"      label          : {data['label']}")
        print(f"      binary         : {data['label_binary']}")
        print(f"      score          : {data['score']:.4f}")
        print(f"      skor_total     : {data['skor_total']}/40")
        print(f"      is_fallback    : {data['is_fallback']}")
        print(f"      probabilities  : {data['probabilities']}")
        return True
    except Exception as e:
        print(f"   ❌ Prediction failed: {e}")
        return False


def test_prediction_low_stress():
    print("\n🔍 Testing POST /api/v1/mental-health/predict (low stress case)...")
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
    try:
        r = requests.post(
            f"{BASE_URL}/api/v1/mental-health/predict", json=payload, timeout=10
        )
        data = r.json()
        assert r.status_code == 200
        assert data["label"] == "RENDAH", f"Expected RENDAH, got {data['label']}"
        assert data["skor_total"] <= 13, (
            f"Skor tinggi untuk RENDAH: {data['skor_total']}"
        )
        print(
            f"   ✅ Low stress case OK (label={data['label']}, skor={data['skor_total']})"
        )
        return True
    except Exception as e:
        print(f"   ❌ Low stress test failed: {e}")
        return False


def test_frontend_consistency():
    print("\n🔍 Testing data consistency between Python API and Go Backend...")
    payload = {
        "q1": 2,
        "q2": 2,
        "q3": 2,
        "q4": 2,
        "q5": 2,
        "q6": 2,
        "q7": 2,
        "q8": 2,
        "q9": 2,
        "q10": 2,
    }
    try:
        # Direct Python API
        r_py = requests.post(
            f"{BASE_URL}/api/v1/mental-health/predict", json=payload, timeout=10
        )
        py_data = r_py.json()

        # Via Go backend (assuming Go running on 8081)
        go_url = "http://localhost:8081/api/v1/mental-health/predict"
        r_go = requests.post(go_url, json=payload, timeout=10)
        if r_go.status_code != 200:
            print(
                f"   ⚠️ Go backend not accessible (status {r_go.status_code}). Skipping Go test."
            )
            return True
        go_data = r_go.json()

        # Check key fields match
        assert go_data["label"] == py_data["label"], (
            f"Label mismatch: Go={go_data['label']}, Py={py_data['label']}"
        )
        assert go_data["skor_total"] == py_data["skor_total"], f"Skor mismatch"
        print(f"   ✅ Go ↔ Python consistency OK")
        return True
    except requests.exceptions.ConnectionError:
        print("   ⚠️ Go backend not running. Skipping Go test.")
        return True
    except Exception as e:
        print(f"   ❌ Consistency test failed: {e}")
        return False


def main():
    print("=" * 60)
    print("  Mental Health API Integration Tests (v2 - 3-Class)")
    print("=" * 60)

    results = []

    # Test 1: Health
    results.append(("Health Check", test_health()))

    # Test 2: Prediction - high stress
    results.append(("Prediction (High)", test_prediction_high_stress()))

    # Test 3: Prediction - low stress
    results.append(("Prediction (Low)", test_prediction_low_stress()))

    # Test 4: Go/Python consistency
    results.append(("Go-Python Consistency", test_frontend_consistency()))

    # Summary
    print("\n" + "=" * 60)
    print("  TEST SUMMARY")
    print("=" * 60)
    passed = sum(1 for _, ok in results if ok)
    total = len(results)
    for name, ok in results:
        status = "✅ PASS" if ok else "❌ FAIL"
        print(f"  {status}  {name}")
    print(f"\n  Total: {passed}/{total} passed")
    print("=" * 60)

    return 0 if passed == total else 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests interrupted by user.")
        sys.exit(130)
