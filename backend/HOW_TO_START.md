# 🚀 How to Start and Connect the Backend

## Step-by-Step Instructions

### Step 1: Open Terminal/PowerShell
Open PowerShell or Command Prompt on Windows.

### Step 2: Navigate to Backend Directory
```powershell
cd C:\hackathon\greenguard-ai\backend
```

### Step 3: Start the Server
Choose one of these methods:

#### Method A: Using the startup script (Easiest)
```powershell
python start_server.py
```

#### Method B: Direct start
```powershell
python main.py
```

#### Method C: Using uvicorn directly
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 4: Verify Server is Running
You should see output like this:
```
INFO:     Started server process [xxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8020 (Press CTRL+C to quit)
```

**✅ If you see this, your backend is running!**

### Step 5: Test the Connection

Open your web browser and visit:

1. **Health Check:**
   ```
   http://localhost:8020/health
   ```
   Should show: `{"status":"healthy"}`

2. **API Documentation:**
   ```
   http://localhost:8020/docs
   ```
   Should show Swagger UI with all API endpoints

3. **Test AQI Endpoint:**
   ```
   http://localhost:8020/api/current-aqi?latitude=17.3850&longitude=78.4867
   ```
   Should return AQI data in JSON format

## 🔗 Connecting Frontend to Backend

### Frontend is Already Configured!
The frontend is already set to connect to `http://localhost:8020`

### To Start Frontend:
1. Open a **NEW** terminal window
2. Navigate to frontend:
   ```powershell
   cd C:\hackathon\greenguard-ai\frontend
   ```
3. Install dependencies (if not done):
   ```powershell
   npm install
   ```
4. Start frontend:
   ```powershell
   npm start
   ```

The frontend will automatically connect to the backend at `http://localhost:8020`

## 📋 Quick Checklist

Before starting, make sure:
- [ ] You're in the `backend` directory
- [ ] All dependencies are installed (`pip install -r requirements.txt`)
- [ ] Model is trained (`cd ml && python train_model.py`)
- [ ] Data file exists (`data/air_quality_data.csv`)

To verify everything:
```powershell
python check_setup.py
```

## 🐛 Troubleshooting

### Problem: "ModuleNotFoundError"
**Solution:** Install dependencies
```powershell
pip install -r requirements.txt
```

### Problem: "Model not found"
**Solution:** Train the model
```powershell
cd ml
python train_model.py
cd ..
```

### Problem: "Port 8000 already in use"
**Solution:** 
1. Find what's using port 8000:
   ```powershell
   netstat -ano | findstr :8020
   ```
2. Kill the process or change port in `main.py`

### Problem: Can't connect from frontend
**Solution:**
1. Make sure backend is running (check for "Uvicorn running" message)
2. Check browser console for errors
3. Verify backend URL in `frontend/src/services/api.js` is `http://localhost:8020`

## 📞 Need Help?

- Check `TROUBLESHOOTING.md` for detailed solutions
- Run `python check_setup.py` to verify setup
- Run `python test_connection.py` to test API (after starting server)

