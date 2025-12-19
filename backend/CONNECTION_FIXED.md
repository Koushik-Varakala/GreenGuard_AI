# ✅ Backend Connection Issues - FIXED!

## What Was Fixed

1. **Missing Dependencies** ✅
   - Installed: `scikit-learn`, `xgboost`, `joblib`
   - All required packages are now installed

2. **ML Model Training** ✅
   - Model trained successfully
   - R² Score: **0.9638** (excellent performance!)
   - Model file created: `ml/aqi_model.pkl`

3. **Import Path Issues** ✅
   - Fixed Python path handling in `main.py`
   - All imports working correctly

4. **XGBoost API Compatibility** ✅
   - Fixed for XGBoost 3.x version
   - Training script updated

## How to Start the Backend

### Option 1: Using the startup script (Recommended)
```powershell
cd greenguard-ai\backend
python start_server.py
```

### Option 2: Direct start
```powershell
cd greenguard-ai\backend
python main.py
```

### Option 3: Using uvicorn directly
```powershell
cd greenguard-ai\backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Verify It's Working

### Quick Test:
1. Start the server (see above)
2. Open browser: `http://localhost:8000/health`
   - Should show: `{"status":"healthy"}`

3. Open browser: `http://localhost:8000/docs`
   - Should show API documentation (Swagger UI)

4. Test API endpoint:
   ```
   http://localhost:8000/api/current-aqi?latitude=17.3850&longitude=78.4867
   ```
   - Should return AQI data

### Automated Test:
```powershell
cd greenguard-ai\backend
python test_connection.py
```
(Make sure server is running first!)

## Expected Server Output

When the server starts successfully, you should see:
```
INFO:     Started server process [xxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

## Connect Frontend

Once backend is running:
1. Start frontend: `cd greenguard-ai\frontend && npm start`
2. Frontend will connect to: `http://localhost:8000`
3. CORS is already configured for `localhost:3000`

## Troubleshooting

If you still have issues:

1. **Check if server is running:**
   - Look for "Uvicorn running on..." message
   - Try accessing `http://localhost:8000/health` in browser

2. **Port conflict:**
   - If port 8000 is busy, change it in `main.py`
   - Or kill the process: `netstat -ano | findstr :8000`

3. **Firewall/Antivirus:**
   - May block localhost connections
   - Try temporarily disabling to test

4. **Verify setup:**
   ```powershell
   python check_setup.py
   ```

## Summary

✅ All dependencies installed
✅ Model trained (R² = 0.9638)
✅ Imports working
✅ Server ready to start

**You're all set!** Just run `python start_server.py` to start the backend.

