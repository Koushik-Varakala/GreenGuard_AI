<<<<<<< HEAD
# GreenGuard AI

An AI-powered environmental monitoring and pollution prevention system that provides real-time air quality monitoring, 7-day pollution prediction, personalized health recommendations, travel exposure analysis, and child-safety features.

## 🚀 Features

- **Real-time AQI Monitoring**: Get current air quality index using latitude & longitude
- **7-Day AQI Forecast**: ML-powered predictions using XGBoost
- **Health Recommendations**: Personalized advice based on AQI and user type (normal/child/elderly/sensitive)
- **Travel Exposure Analysis**: Calculate pollution exposure for source-to-destination routes
- **Alert System**: Warnings when AQI exceeds safe limits
- **Clean Dashboard**: Modern UI with charts and interactive maps

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **XGBoost** - Machine learning model for AQI prediction
- **Pandas/NumPy** - Data processing
- **Scikit-learn** - ML utilities
- **Uvicorn** - ASGI server

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Database
- **CSV files** - Historical data storage (MongoDB ready for production)

## 📁 Project Structure

```
greenguard-ai/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── routes/                 # API routes
│   │   ├── aqi_routes.py      # AQI endpoints
│   │   ├── recommendations_routes.py
│   │   └── travel_routes.py
│   ├── ml/                     # Machine learning
│   │   ├── train_model.py     # Model training script
│   │   ├── predict.py          # Prediction module
│   │   └── aqi_model.pkl       # Trained model (generated)
│   ├── data/
│   │   ├── air_quality_data.csv  # Historical data
│   │   └── generate_data_simple.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   └── services/          # API services
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd greenguard-ai/backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Generate sample data (if not already generated):**
   ```bash
   cd data
   python generate_data_simple.py
   cd ..
   ```

5. **Train the ML model:**
   ```bash
   cd ml
   python train_model.py
   cd ..
   ```

6. **Start the FastAPI server:**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8020`
   API documentation: `http://localhost:8020/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd greenguard-ai/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 📡 API Endpoints

### 1. Get Current AQI
```
GET /api/current-aqi?latitude=<lat>&longitude=<lon>
```

**Response:**
```json
{
  "aqi": 152.0,
  "pm25": 68.0,
  "pm10": 120.0,
  "co2": 420.0,
  "temperature": 32.0,
  "humidity": 60.0,
  "wind_speed": 3.2,
  "status": "Unhealthy for Sensitive Groups",
  "timestamp": "2024-12-18T10:30:00"
}
```

### 2. Get Forecast
```
GET /api/forecast?latitude=<lat>&longitude=<lon>&days=7
```

**Response:**
```json
{
  "forecast": [
    {"date": "2024-12-19", "aqi": 145.2},
    {"date": "2024-12-20", "aqi": 138.5},
    ...
  ]
}
```

### 3. Get Recommendations
```
POST /api/recommendations
Body: {
  "aqi": 152.0,
  "user_type": "child"
}
```

**Response:**
```json
{
  "recommendations": ["Stay indoors...", ...],
  "risk_level": "Moderate to High",
  "outdoor_activity": "Limit Outdoor Activities",
  "mask_required": true,
  "air_purifier": true
}
```

### 4. Travel Exposure Analysis
```
POST /api/travel-exposure
Body: {
  "source_lat": 17.3850,
  "source_lon": 78.4867,
  "dest_lat": 28.6139,
  "dest_lon": 77.2090,
  "travel_mode": "driving"
}
```

## 🤖 Machine Learning Model

### Model Details
- **Algorithm**: XGBoost Regressor
- **Target**: AQI prediction for next 1-7 days
- **Features**:
  - Date features: day, month, weekday
  - Lag features: aqi_lag_1, aqi_lag_2, aqi_lag_3
  - Environmental: pm25, pm10, co2, temperature, humidity, wind_speed

### Training
```bash
cd backend/ml
python train_model.py
```

Expected performance:
- R² Score: ≥ 0.85
- Fast inference suitable for real-time APIs

### Model Files
- `aqi_model.pkl` - Trained XGBoost model
- `feature_names.pkl` - Feature names for prediction

## 📊 Dataset Format

The dataset (`air_quality_data.csv`) should have the following columns:

```
date,city,lat,lon,aqi,pm25,pm10,co2,temperature,humidity,wind_speed
2024-01-01,Hyderabad,17.385,78.4867,152,68,120,420,32,60,3.2
```

## 🎯 Usage Examples

### Using the Dashboard

1. **Set Location**: Enter latitude and longitude
2. **Select User Type**: Choose normal/child/elderly/sensitive
3. **View Current AQI**: See real-time air quality
4. **Check Forecast**: View 7-day predictions
5. **Get Recommendations**: See personalized health advice
6. **Analyze Travel**: Enter source and destination for route analysis

### Using the API Directly

```python
import requests

# Get current AQI
response = requests.get(
    "http://localhost:8020/api/current-aqi",
    params={"latitude": 17.3850, "longitude": 78.4867}
)
print(response.json())

# Get forecast
response = requests.get(
    "http://localhost:8020/api/forecast",
    params={"latitude": 17.3850, "longitude": 78.4867, "days": 7}
)
print(response.json())
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory (optional):

```env
API_URL=http://localhost:8020
MONGODB_URI=mongodb://localhost:27017/greenguard
WAQI_API_KEY=your_waqi_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

### Frontend API URL

Update `frontend/src/services/api.js` if your backend runs on a different port:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8020';
```

## 🧪 Testing

### Test Backend
```bash
cd backend
python -m pytest  # If tests are added
```

### Test Frontend
```bash
cd frontend
npm test
```

## 📝 Development Notes

- The model uses historical data patterns for predictions
- For production, integrate with real-time APIs (WAQI, OpenAQ)
- MongoDB integration is ready but uses CSV for MVP
- Map integration can be added using Mapbox or Google Maps API

## 🐛 Troubleshooting

### Model Not Found Error
- Ensure you've run `train_model.py` to generate `aqi_model.pkl`
- Check that the model file exists in `backend/ml/`

### Data File Not Found
- Run `generate_data_simple.py` in `backend/data/`
- Ensure `air_quality_data.csv` exists

### CORS Errors
- Check that backend CORS settings include your frontend URL
- Default: `http://localhost:3000` and `http://localhost:5173`

### Port Already in Use
- Backend: Change port in `main.py` or uvicorn command
- Frontend: Set `PORT=3001` in environment or edit `package.json`

## 📄 License

This project is created for hackathons and academic evaluation.

## 👥 Contributing

This is a complete production-ready project. Feel free to extend it with:
- Real-time API integrations
- MongoDB database
- User authentication
- Historical data visualization
- Mobile app
- Email/SMS alerts

## 🙏 Acknowledgments

- XGBoost for powerful ML predictions
- FastAPI for excellent Python web framework
- React community for amazing tools

---

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- API Keys for OpenWeather and OpenAQ (optional for demo)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd greenguard-ai/backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Generate sample data (optional):
   ```bash
   python data/generate_sample_data.py
   ```

4. Train the ML model (optional):
   ```bash
   python ml/train_model.py
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will be running at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd greenguard-ai/frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The frontend will be running at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the backend directory with:

```
OPENWEATHER_API_KEY=your_openweather_api_key
```

For demo purposes, the app works with mock data if API keys are not provided.

### Usage

1. Open the frontend in your browser
2. View current AQI on the dashboard
3. Check 7-day forecast
4. Analyze travel routes
5. Get health recommendations

**Built with ❤️ for environmental awareness**

=======
# GreenGuard_AI
>>>>>>> 5dfb5d54ea8c9783382aaa1a25894f2fc13edf8e
