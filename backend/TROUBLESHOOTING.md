# Backend Connection Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "ModuleNotFoundError" or "No module named 'routes'"

**Solution:**
1. Make sure you're in the `backend` directory when running the server
2. Use the startup script: `python start_server.py`
3. Or run from backend directory: `cd greenguard-ai\backend && python main.py`

### Issue 2: Missing Dependencies

**Symptoms:** `ModuleNotFoundError: No module named 'fastapi'` or similar

**Solution:**
```powershell
cd greenguard-ai\backend
pip install -r requirements.txt
```

If you're using a virtual environment:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Issue 3: Model Not Found

**Symptoms:** `FileNotFoundError: Model not found at .../aqi_model.pkl`

**Solution:**
```powershell
cd greenguard-ai\backend\ml
python train_model.py
```

### Issue 4: Data File Not Found

**Symptoms:** `FileNotFoundError: Data file not found`

**Solution:**
```powershell
cd greenguard-ai\backend\data
python generate_data_simple.py
```

### Issue 5: Port Already in Use

**Symptoms:** `Address already in use` or `Port 8000 is already in use`

**Solution:**
1. Find and stop the process using port 8000:
   ```powershell
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   ```
2. Or change the port in `main.py`:
   ```python
   uvicorn.run(app, host="0.0.0.0", port=8001)
   ```

### Issue 6: CORS Errors in Frontend

**Symptoms:** Frontend can't connect, CORS policy errors

**Solution:**
1. Make sure backend is running on `http://localhost:8000`
2. Check that frontend URL is in CORS origins in `main.py`
3. Restart both backend and frontend

## Step-by-Step Setup

### Complete Backend Setup:

```powershell
# 1. Navigate to backend
cd greenguard-ai\backend

# 2. Create virtual environment (recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# 3. Install dependencies
pip install -r requirements.txt

# 4. Verify setup
python check_setup.py

# 5. Generate data (if needed)
cd data
python generate_data_simple.py
cd ..

# 6. Train model (if needed)
cd ml
python train_model.py
cd ..

# 7. Start server
python start_server.py
```

## Testing the Connection

### Test 1: Health Check
Open browser: `http://localhost:8000/health`
Should return: `{"status":"healthy"}`

### Test 2: Root Endpoint
Open browser: `http://localhost:8000/`
Should return API information

### Test 3: API Documentation
Open browser: `http://localhost:8000/docs`
Should show Swagger UI

### Test 4: Current AQI Endpoint
Open browser: `http://localhost:8000/api/current-aqi?latitude=17.3850&longitude=78.4867`
Should return AQI data

## Quick Verification Script

Run this to check everything:
```powershell
cd greenguard-ai\backend
python check_setup.py
```

This will tell you:
- ✓ What's working
- ✗ What needs to be fixed
- Step-by-step instructions

## Still Having Issues?

1. **Check Python version:** `python --version` (should be 3.8+)
2. **Check if server is running:** Look for "Uvicorn running on..." message
3. **Check firewall:** Windows Firewall might be blocking port 8000
4. **Check antivirus:** Some antivirus software blocks local servers
5. **Try different port:** Change to 8001 or 8080

## Expected Output When Server Starts:

```
INFO:     Started server process [xxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

If you see this, the server is running correctly!

