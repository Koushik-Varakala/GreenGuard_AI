# Quick Setup Guide

## 🚀 Fast Setup (Windows PowerShell)

### Backend Setup

```powershell
# Navigate to backend
cd greenguard-ai\backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Generate data (if needed)
cd data
python generate_data_simple.py
cd ..

# Train model
cd ml
python train_model.py
cd ..

# Start server
python main.py
```

### Frontend Setup

```powershell
# Navigate to frontend (in a new terminal)
cd greenguard-ai\frontend

# Install dependencies
npm install

# Start development server
npm start
```

## ✅ Verification Checklist

- [ ] Backend dependencies installed
- [ ] Data file exists: `backend/data/air_quality_data.csv`
- [ ] Model trained: `backend/ml/aqi_model.pkl` exists
- [ ] Backend server running on `http://localhost:8000`
- [ ] Frontend dependencies installed
- [ ] Frontend running on `http://localhost:3000`

## 🧪 Test API

Open browser and visit:
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- Test Endpoint: http://localhost:8000/api/current-aqi?latitude=17.3850&longitude=78.4867

## 🐛 Common Issues

### Issue: Model not found
**Solution**: Run `python backend/ml/train_model.py`

### Issue: Data file not found
**Solution**: Run `python backend/data/generate_data_simple.py`

### Issue: Port already in use
**Solution**: 
- Backend: Change port in `main.py` or use `uvicorn main:app --port 8001`
- Frontend: Set `PORT=3001` in environment

### Issue: CORS errors
**Solution**: Check that backend CORS includes frontend URL (default: localhost:3000)

