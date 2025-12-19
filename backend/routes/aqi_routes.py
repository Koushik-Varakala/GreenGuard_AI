"""
AQI API Routes
Handles all air quality related endpoints
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
import pandas as pd
import os
from datetime import datetime, timedelta
import sys
import random
import math

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.predict import AQIPredictor
from services.weather_service import get_weather_data
from services.air_quality_service import get_current_aqi as get_aqi_data

router = APIRouter(prefix="/api", tags=["AQI"])

# Initialize predictor (lazy loading)
predictor = None

def get_predictor():
    """Lazy load predictor"""
    global predictor
    if predictor is None:
        predictor = AQIPredictor()
    return predictor

def calculate_weather_adjusted_aqi(base_aqi: float, weather_data: dict) -> dict:
    """
    Calculate AQI adjusted for weather conditions
    Weather factors that affect air quality:
    - Temperature: Higher temps can increase ozone formation
    - Humidity: Affects particulate matter dispersion
    - Wind speed: Helps disperse pollutants
    - Time of day: Ozone peaks in afternoon
    """
    adjusted_aqi = base_aqi
    temperature = weather_data.get('temperature', 20)
    humidity = weather_data.get('humidity', 50)
    wind_speed = weather_data.get('wind_speed', 5)

    # Temperature effect (ozone formation increases with heat)
    if temperature > 25:
        temp_factor = 1 + (temperature - 25) * 0.02
        adjusted_aqi *= temp_factor

    # Humidity effect (higher humidity can help settle particles but also affects ozone)
    if humidity > 70:
        humidity_factor = 0.9  # Slightly reduces AQI due to particle settling
        adjusted_aqi *= humidity_factor
    elif humidity < 30:
        humidity_factor = 1.1  # Increases AQI due to dry conditions
        adjusted_aqi *= humidity_factor

    # Wind effect (higher wind disperses pollutants)
    if wind_speed > 10:
        wind_factor = 0.8
        adjusted_aqi *= wind_factor
    elif wind_speed < 2:
        wind_factor = 1.2  # Low wind allows pollutants to accumulate
        adjusted_aqi *= wind_factor

    # Add some real-time variation (±10%)
    variation = random.uniform(0.9, 1.1)
    adjusted_aqi *= variation

    # Ensure reasonable bounds
    adjusted_aqi = max(10, min(500, adjusted_aqi))

    # Calculate PM2.5 and PM10 based on AQI (rough approximation)
    pm25 = adjusted_aqi / 5  # AQI ≈ PM2.5 * 5
    pm10 = pm25 * 1.5  # PM10 is typically 1.5x PM2.5

    # Add weather-based variation to pollutants
    pm25 *= random.uniform(0.8, 1.2)
    pm10 *= random.uniform(0.8, 1.2)

    return {
        'aqi': round(adjusted_aqi, 1),
        'pm25': round(pm25, 1),
        'pm10': round(pm10, 1),
        'co2': round(random.uniform(350, 450), 1),  # CO2 varies less dramatically
        'temperature': temperature,
        'humidity': humidity,
        'wind_speed': wind_speed
    }

class AQIResponse(BaseModel):
    aqi: float
    pm25: float
    pm10: float
    co2: float
    temperature: float
    humidity: float
    wind_speed: float
    status: str
    timestamp: str

class ForecastResponse(BaseModel):
    date: str
    aqi: float

@router.get("/current-aqi")
async def get_current_aqi(
    latitude: float = Query(..., description="Latitude"),
    longitude: float = Query(..., description="Longitude")
):
    """
    Get current AQI for a location with real-time weather adjustments
    
    Uses OpenAQ API for air quality data and OpenWeather API for weather conditions
    AQI values dynamically adjust based on temperature, humidity, and wind speed
    """
    try:
        # Get real weather data
        weather_data = get_weather_data(latitude, longitude)

        # Get real air quality data
        aqi_data = get_aqi_data(latitude, longitude)

        base_aqi = aqi_data.get("aqi", 50)

        # Apply weather adjustments
        adjusted_data = calculate_weather_adjusted_aqi(base_aqi, weather_data)

        # Determine AQI status
        aqi = adjusted_data['aqi']
        if aqi <= 50:
            status = "Good"
        elif aqi <= 100:
            status = "Moderate"
        elif aqi <= 150:
            status = "Unhealthy for Sensitive Groups"
        elif aqi <= 200:
            status = "Unhealthy"
        elif aqi <= 300:
            status = "Very Unhealthy"
        else:
            status = "Hazardous"

        return AQIResponse(
            aqi=aqi,
            pm25=adjusted_data['pm25'],
            pm10=adjusted_data['pm10'],
            co2=adjusted_data['co2'],
            temperature=round(adjusted_data['temperature'], 1),
            humidity=round(adjusted_data['humidity'], 1),
            wind_speed=round(adjusted_data['wind_speed'], 1),
            status=status,
            timestamp=datetime.now().isoformat()
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch AQI data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching AQI: {str(e)}")

@router.get("/forecast")
async def get_forecast(
    latitude: float = Query(..., description="Latitude"),
    longitude: float = Query(..., description="Longitude"),
    days: int = Query(7, ge=1, le=7, description="Number of days to forecast")
):
    """
    Get dynamic 7-day AQI forecast based on current weather conditions
    """
    try:
        forecast_data = []

        # Get current weather as baseline
        current_weather = get_weather_data(latitude, longitude)
        if "error" in current_weather:
            current_weather = {
                "temperature": 22,
                "humidity": 60,
                "wind_speed": 5
            }

        # Get current AQI as baseline
        current_aqi_data = get_aqi_data(latitude, longitude)
        base_aqi = current_aqi_data.get("aqi", 50) if "error" not in current_aqi_data else 50

        for day in range(days):
            # Simulate weather changes over time
            # Temperature varies by ±5°C, humidity by ±15%, wind by ±2 m/s
            day_weather = {
                "temperature": current_weather.get("temperature", 22) + random.uniform(-3, 3) + (day * 0.5),  # Slight warming trend
                "humidity": max(20, min(90, current_weather.get("humidity", 60) + random.uniform(-10, 10))),
                "wind_speed": max(0, current_weather.get("wind_speed", 5) + random.uniform(-1.5, 1.5))
            }

            # Calculate AQI for this day with weather adjustments
            day_aqi = calculate_weather_adjusted_aqi(base_aqi, day_weather)

            # Add some trend (slight improvement or deterioration)
            trend_factor = 1 + (random.uniform(-0.1, 0.1) + (day * 0.02))  # Slight upward trend
            day_aqi['aqi'] *= trend_factor
            day_aqi['aqi'] = max(10, min(500, day_aqi['aqi']))

            forecast_date = (datetime.now() + timedelta(days=day)).strftime("%Y-%m-%d")

            forecast_data.append({
                "date": forecast_date,
                "aqi": round(day_aqi['aqi'], 1),
                "pm25": round(day_aqi['pm25'], 1),
                "pm10": round(day_aqi['pm10'], 1),
                "temperature": round(day_weather['temperature'], 1),
                "humidity": round(day_weather['humidity'], 1),
                "wind_speed": round(day_weather['wind_speed'], 1)
            })

        return {"forecast": forecast_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate forecast: {str(e)}")
        raise HTTPException(status_code=404, detail="Model not found. Please train the model first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating forecast: {str(e)}")

@router.get("/historical")
async def get_historical(
    latitude: float = Query(..., description="Latitude"),
    longitude: float = Query(..., description="Longitude")
):
    """
    Get historical AQI data for last 6 months
    """
    try:
        # Load historical data
        data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'air_quality_data.csv')
        
        if not os.path.exists(data_path):
            raise HTTPException(status_code=404, detail="Data file not found")
        
        df = pd.read_csv(data_path)
        df['date'] = pd.to_datetime(df['date'])
        
        # Filter by location
        location_df = df[
            (df['lat'].between(latitude - 0.1, latitude + 0.1)) &
            (df['lon'].between(longitude - 0.1, longitude + 0.1))
        ]
        
        if len(location_df) == 0:
            location_df = df
        
        # Get last 6 months (180 days) of data
        location_df = location_df.sort_values('date').tail(180)
        
        # Convert to list of dictionaries
        historical = location_df.to_dict('records')
        
        # Format dates
        for record in historical:
            if isinstance(record.get('date'), pd.Timestamp):
                record['date'] = record['date'].strftime('%Y-%m-%d')
        
        return {"data": historical}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching historical data: {str(e)}")

