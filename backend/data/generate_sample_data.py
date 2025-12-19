"""
Generate sample air quality dataset
Creates realistic historical AQI data for training
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_sample_data(num_days=365, output_file="air_quality_data.csv"):
    """Generate sample air quality data"""
    
    # Base locations (cities)
    locations = [
        {"city": "Hyderabad", "lat": 17.3850, "lon": 78.4867},
        {"city": "Delhi", "lat": 28.6139, "lon": 77.2090},
        {"city": "Mumbai", "lat": 19.0760, "lon": 72.8777},
        {"city": "Bangalore", "lat": 12.9716, "lon": 77.5946},
        {"city": "Chennai", "lat": 13.0827, "lon": 80.2707},
    ]
    
    all_data = []
    start_date = datetime.now() - timedelta(days=num_days)
    
    for location in locations:
        city = location["city"]
        lat = location["lat"]
        lon = location["lon"]
        
        # Generate data for each day
        for day in range(num_days):
            date = start_date + timedelta(days=day)
            
            # Seasonal patterns
            month = date.month
            day_of_year = date.timetuple().tm_yday
            
            # Base AQI varies by season (higher in winter months for some cities)
            if month in [11, 12, 1, 2]:  # Winter
                base_aqi = np.random.normal(180, 30)
            elif month in [3, 4, 5]:  # Spring
                base_aqi = np.random.normal(140, 25)
            elif month in [6, 7, 8, 9]:  # Monsoon
                base_aqi = np.random.normal(100, 20)
            else:  # Fall
                base_aqi = np.random.normal(130, 25)
            
            # Add some randomness and trends
            aqi = max(20, min(400, base_aqi + np.random.normal(0, 15)))
            
            # Correlated pollutants
            pm25 = max(10, aqi * 0.45 + np.random.normal(0, 5))
            pm10 = max(15, aqi * 0.78 + np.random.normal(0, 8))
            co2 = max(350, 400 + (aqi - 100) * 0.5 + np.random.normal(0, 10))
            
            # Weather patterns
            if month in [5, 6, 7, 8]:  # Summer/Monsoon
                temperature = np.random.normal(30, 3)
                humidity = np.random.normal(75, 10)
            elif month in [11, 12, 1, 2]:  # Winter
                temperature = np.random.normal(22, 4)
                humidity = np.random.normal(50, 10)
            else:
                temperature = np.random.normal(28, 3)
                humidity = np.random.normal(65, 10)
            
            wind_speed = max(0.5, np.random.normal(3.5, 1.5))
            
            all_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "city": city,
                "lat": lat,
                "lon": lon,
                "aqi": round(aqi, 1),
                "pm25": round(pm25, 1),
                "pm10": round(pm10, 1),
                "co2": round(co2, 1),
                "temperature": round(temperature, 1),
                "humidity": round(humidity, 1),
                "wind_speed": round(wind_speed, 1)
            })
    
    # Create DataFrame and save
    df = pd.DataFrame(all_data)
    df = df.sort_values(['city', 'date']).reset_index(drop=True)
    
    output_path = f"air_quality_data.csv"
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} records")
    print(f"Saved to: {output_path}")
    print(f"Date range: {df['date'].min()} to {df['date'].max()}")
    print(f"Cities: {df['city'].unique()}")
    
    return df

if __name__ == "__main__":
    generate_sample_data(num_days=365)

