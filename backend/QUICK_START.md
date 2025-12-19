# Quick Start Guide - Fix Backend Connection

## Step 1: Install Missing Dependencies

Open PowerShell in the `greenguard-ai\backend` directory and run:

```powershell
pip install -r requirements.txt
```

Or install individually:
```powershell
pip install scikit-learn xgboost joblib
```

## Step 2: Train the ML Model

```powershell
cd ml
python train_model.py
cd ..
```

This will create the `aqi_model.pkl` file needed for predictions.

## Step 3: Start the Server

```powershell
python start_server.py
```

Or:
```powershell
python main.py
```

## Step 4: Verify It's Working

1. Open browser: `http://localhost:8000/health`
   - Should show: `{"status":"healthy"}`

2. Open browser: `http://localhost:8000/docs`
   - Should show API documentation

3. Test endpoint: `http://localhost:8000/api/current-aqi?latitude=17.3850&longitude=78.4867`
   - Should return AQI data

## Quick Setup Script (Windows)

Run the batch file:
```powershell
.\quick_setup.bat
```

This will:
- Install all dependencies
- Train the model
- Tell you when it's ready

## Still Can't Connect?

### Check 1: Is the server running?
Look for this message:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Check 2: Check for errors
Run the verification:
```powershell
python check_setup.py
```

### Check 3: Port conflict?
If port 8000 is busy, change it in `main.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Check 4: Firewall/Antivirus
- Windows Firewall might block port 8000
- Some antivirus software blocks local servers
- Try temporarily disabling to test

## Common Error Messages

### "ModuleNotFoundError: No module named 'xgboost'"
**Fix:** `pip install xgboost`

### "FileNotFoundError: Model not found"
**Fix:** Run `cd ml && python train_model.py`

### "Address already in use"
**Fix:** Change port or kill the process using port 8000

### "Connection refused" in frontend
**Fix:** 
1. Make sure backend is running
2. Check backend URL in `frontend/src/services/api.js`
3. Check CORS settings in `backend/main.py`

## Need More Help?

See `TROUBLESHOOTING.md` for detailed solutions.

