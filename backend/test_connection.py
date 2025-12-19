"""
Quick test script to verify backend is working
Run this after starting the server
"""

import requests
import time

def test_backend():
    base_url = "http://localhost:8020"
    
    print("=" * 50)
    print("Testing GreenGuard AI Backend Connection")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n[1] Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print(f"  [OK] Health check: {response.json()}")
        else:
            print(f"  [ERROR] Status code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("  [ERROR] Cannot connect to server. Is it running?")
        print("  Start server with: python start_server.py")
        return False
    except Exception as e:
        print(f"  [ERROR] {e}")
        return False
    
    # Test 2: Root endpoint
    print("\n[2] Testing root endpoint...")
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print(f"  [OK] Root endpoint working")
        else:
            print(f"  [ERROR] Status code: {response.status_code}")
    except Exception as e:
        print(f"  [ERROR] {e}")
    
    # Test 3: Current AQI endpoint
    print("\n[3] Testing current AQI endpoint...")
    try:
        response = requests.get(
            f"{base_url}/api/current-aqi",
            params={"latitude": 17.3850, "longitude": 78.4867},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            print(f"  [OK] AQI: {data.get('aqi')}, Status: {data.get('status')}")
        else:
            print(f"  [ERROR] Status code: {response.status_code}")
            print(f"  Response: {response.text}")
    except Exception as e:
        print(f"  [ERROR] {e}")
    
    # Test 4: Forecast endpoint
    print("\n[4] Testing forecast endpoint...")
    try:
        response = requests.get(
            f"{base_url}/api/forecast",
            params={"latitude": 17.3850, "longitude": 78.4867, "days": 7},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            forecast_count = len(data.get('forecast', []))
            print(f"  [OK] Forecast: {forecast_count} days")
        else:
            print(f"  [ERROR] Status code: {response.status_code}")
            print(f"  Response: {response.text}")
    except Exception as e:
        print(f"  [ERROR] {e}")
    
    print("\n" + "=" * 50)
    print("Testing complete!")
    print("=" * 50)
    print("\nIf all tests passed, your backend is working correctly!")
    print("You can now connect your frontend to: http://localhost:8020")
    
    return True

if __name__ == "__main__":
    print("\nMake sure the server is running first!")
    print("Start it with: python start_server.py\n")
    time.sleep(2)
    test_backend()

