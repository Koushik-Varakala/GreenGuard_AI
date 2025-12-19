import requests
import os
import time
from functools import lru_cache

# Simple in-memory cache
_cache = {}

def get_weather_data(lat: float, lon: float):
    # Create cache key
    cache_key = f"weather_{lat}_{lon}"
    current_time = time.time()

    # Check cache (5 minute cache)
    if cache_key in _cache:
        cached_data, timestamp = _cache[cache_key]
        if current_time - timestamp < 300:  # 5 minutes
            return cached_data

    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        # Return mock data if no API key
        return {
            "wind_speed": 3.5,
            "temperature": 22,
            "humidity": 65,
            "description": "Clear sky"
        }

    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        response = requests.get(url, timeout=5)  # Reduced timeout
        response.raise_for_status()
        data = response.json()

        result = {
            "wind_speed": data['wind'].get('speed', 0),
            "temperature": data['main'].get('temp', 0),
            "humidity": data['main'].get('humidity', 0),
            "description": data['weather'][0].get('description', 'Clear sky') if data.get('weather') else 'Clear sky'
        }

        # Cache the result
        _cache[cache_key] = (result, current_time)
        return result

    except requests.RequestException:
        # Return cached data if available, otherwise mock data
        if cache_key in _cache:
            return _cache[cache_key][0]

        return {
            "wind_speed": 3.5,
            "temperature": 22,
            "humidity": 65,
            "description": "Clear sky"
        }