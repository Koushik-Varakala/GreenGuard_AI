"""
Check if backend setup is correct
Run this to verify all dependencies and files are in place
"""

import sys
import os
from pathlib import Path

print("=" * 50)
print("GreenGuard AI - Setup Verification")
print("=" * 50)

# Check Python version
print(f"\n[1] Python Version: {sys.version}")

# Check dependencies
print("\n[2] Checking Dependencies...")
required_packages = [
    'fastapi',
    'uvicorn',
    'pydantic',
    'pandas',
    'numpy',
    'scikit-learn',
    'xgboost',
    'joblib',
    'requests'
]

missing_packages = []
for package in required_packages:
    try:
        __import__(package)
        print(f"  [OK] {package}")
    except ImportError:
        print(f"  [MISSING] {package}")
        missing_packages.append(package)

if missing_packages:
    print(f"\n[WARNING] Missing packages: {', '.join(missing_packages)}")
    print("Run: pip install -r requirements.txt")
else:
    print("\n[SUCCESS] All dependencies installed")

# Check data file
print("\n[3] Checking Data Files...")
data_file = Path(__file__).parent / "data" / "air_quality_data.csv"
if data_file.exists():
    print(f"  [OK] Data file exists: {data_file}")
else:
    print(f"  [MISSING] Data file: {data_file}")
    print("  Run: cd data && python generate_data_simple.py")

# Check model file
print("\n[4] Checking ML Model...")
model_file = Path(__file__).parent / "ml" / "aqi_model.pkl"
if model_file.exists():
    print(f"  [OK] Model file exists: {model_file}")
else:
    print(f"  [MISSING] Model file: {model_file}")
    print("  Run: cd ml && python train_model.py")

# Check imports
print("\n[5] Testing Imports...")
try:
    sys.path.insert(0, str(Path(__file__).parent))
    from routes import aqi_routes, recommendations_routes, travel_routes
    from main import app
    print("  [OK] All imports successful")
except Exception as e:
    print(f"  [ERROR] Import error: {e}")

print("\n" + "=" * 50)
if not missing_packages and data_file.exists() and model_file.exists():
    print("[SUCCESS] Setup Complete! You can start the server with:")
    print("  python start_server.py")
    print("  or")
    print("  python main.py")
else:
    print("[WARNING] Please fix the issues above before starting the server")
print("=" * 50)

