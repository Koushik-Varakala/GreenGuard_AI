"""
Simple data generator using only standard library
"""

import csv
import os
import random
from datetime import datetime, timedelta

def generate_data():
    locations = [
        {"city": "Hyderabad", "lat": 17.3850, "lon": 78.4867},
        {"city": "Delhi", "lat": 28.6139, "lon": 77.2090},
        {"city": "Mumbai", "lat": 19.0760, "lon": 72.8777},
        {"city": "Bangalore", "lat": 12.9716, "lon": 77.5946},
        {"city": "Chennai", "lat": 13.0827, "lon": 80.2707},
    ]
    
    # Generate 6 months (180 days) of data
    start_date = datetime.now() - timedelta(days=180)
    data = []
    
    for loc in locations:
        for day in range(180):
            date = start_date + timedelta(days=day)
            month = date.month
            
            # Seasonal AQI
            if month in [11, 12, 1, 2]:
                base_aqi = random.gauss(180, 30)
            elif month in [3, 4, 5]:
                base_aqi = random.gauss(140, 25)
            elif month in [6, 7, 8, 9]:
                base_aqi = random.gauss(100, 20)
            else:
                base_aqi = random.gauss(130, 25)
            
            aqi = max(20, min(400, base_aqi))
            pm25 = max(10, aqi * 0.45 + random.gauss(0, 5))
            pm10 = max(15, aqi * 0.78 + random.gauss(0, 8))
            co2 = max(350, 400 + (aqi - 100) * 0.5 + random.gauss(0, 10))
            
            if month in [5, 6, 7, 8]:
                temp = random.gauss(30, 3)
                humidity = random.gauss(75, 10)
            elif month in [11, 12, 1, 2]:
                temp = random.gauss(22, 4)
                humidity = random.gauss(50, 10)
            else:
                temp = random.gauss(28, 3)
                humidity = random.gauss(65, 10)
            
            wind = max(0.5, random.gauss(3.5, 1.5))
            
            data.append([
                date.strftime("%Y-%m-%d"),
                loc["city"],
                loc["lat"],
                loc["lon"],
                round(aqi, 1),
                round(pm25, 1),
                round(pm10, 1),
                round(co2, 1),
                round(temp, 1),
                round(humidity, 1),
                round(wind, 1)
            ])
    
    file_path = os.path.join(os.path.dirname(__file__), "air_quality_data.csv")
    with open(file_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["date", "city", "lat", "lon", "aqi", "pm25", "pm10", "co2", "temperature", "humidity", "wind_speed"])
        writer.writerows(data)
    
    print(f"Generated {len(data)} records")
    print(f"Saved to: {file_path}")

if __name__ == "__main__":
    generate_data()

