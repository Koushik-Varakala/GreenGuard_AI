"""
Travel Exposure Analysis API Routes
Calculates pollution exposure for travel routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import os
import math
import requests
from typing import List, Dict

router = APIRouter(prefix="/api", tags=["Travel"])

class TravelRequest(BaseModel):
    source_lat: float
    source_lon: float
    dest_lat: float
    dest_lon: float
    travel_mode: str = "driving"  # driving, walking, cycling

class StateAnalysis(BaseModel):
    state: str
    distance_km: float
    average_aqi: float
    risk_level: str

class TravelResponse(BaseModel):
    source_aqi: float
    dest_aqi: float
    route_average_aqi: float
    exposure_level: str
    risk_assessment: str
    recommendations: List[str]
    total_distance_km: float
    state_breakdown: List[StateAnalysis]
    travel_mode: str

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points using Haversine formula"""
    R = 6371  # Earth radius in km
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c

def get_state_from_coords(lat: float, lon: float) -> str:
    """Simple state determination based on coordinates (US only)"""
    # This is a simplified version - in production, use a proper geolocation service
    if 32.5 <= lat <= 42.0 and -124.7 <= lon <= -114.1:
        return "California"
    elif 40.5 <= lat <= 45.0 and -79.8 <= lon <= -71.8:
        return "New York"
    elif 25.0 <= lat <= 31.0 and -87.6 <= lon <= -80.0:
        return "Florida"
    elif 36.0 <= lat <= 42.0 and -109.0 <= lon <= -102.0:
        return "Colorado"
    elif 41.0 <= lat <= 43.5 and -87.9 <= lon <= -84.7:
        return "Michigan"
    elif 33.0 <= lat <= 37.0 and -84.0 <= lon <= -75.0:
        return "Georgia"
    elif 35.0 <= lat <= 40.0 and -90.0 <= lon <= -80.0:
        return "Tennessee"
    elif 38.0 <= lat <= 42.0 and -85.0 <= lon <= -80.0:
        return "Ohio"
    elif 39.0 <= lat <= 43.0 and -95.0 <= lon <= -89.0:
        return "Illinois"
    else:
        return "Unknown"

def get_states_along_route(source_lat: float, source_lon: float, dest_lat: float, dest_lon: float, num_points: int = 10) -> List[str]:
    """Get list of states along the route by sampling points"""
    states = []
    
    # Sample points along the route
    for i in range(num_points + 1):
        t = i / num_points
        lat = source_lat + t * (dest_lat - source_lat)
        lon = source_lon + t * (dest_lon - source_lon)
        state = get_state_from_coords(lat, lon)
        if state not in states:
            states.append(state)
    
    return states

def get_real_time_aqi(lat: float, lon: float) -> float:
    """Get real-time AQI from external API"""
    try:
        # Using OpenAQ API for real air quality data
        url = "https://api.openaq.org/v2/latest"
        params = {
            "coordinates": f"{lat},{lon}",
            "radius": 10000,  # 10km radius
            "limit": 1
        }
        
        response = requests.get(url, params=params, timeout=5)
        data = response.json()
        
        if data.get("results") and len(data["results"]) > 0:
            measurements = data["results"][0].get("measurements", [])
            pm25_measurements = [m for m in measurements if m.get("parameter") == "pm25"]
            if pm25_measurements:
                # Convert PM2.5 to AQI (simplified conversion)
                pm25 = pm25_measurements[0].get("value", 0)
                if pm25 <= 12.0:
                    aqi = (50/12.0) * pm25
                elif pm25 <= 35.4:
                    aqi = 50 + ((100-50)/(35.4-12.0)) * (pm25 - 12.0)
                elif pm25 <= 55.4:
                    aqi = 100 + ((150-100)/(55.4-35.4)) * (pm25 - 35.4)
                elif pm25 <= 150.4:
                    aqi = 150 + ((200-150)/(150.4-55.4)) * (pm25 - 55.4)
                elif pm25 <= 250.4:
                    aqi = 200 + ((300-200)/(250.4-150.4)) * (pm25 - 150.4)
                elif pm25 <= 350.4:
                    aqi = 300 + ((400-300)/(350.4-250.4)) * (pm25 - 250.4)
                else:
                    aqi = 500
                return min(aqi, 500)  # Cap at 500
        
        # Fallback to local data if API fails
        return get_aqi_from_local_data(lat, lon)
        
    except Exception as e:
        print(f"Error fetching real-time AQI: {e}")
        return get_aqi_from_local_data(lat, lon)

def get_aqi_from_local_data(lat: float, lon: float) -> float:
    """Fallback to local CSV data"""
    try:
        data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'air_quality_data.csv')
        df = pd.read_csv(data_path)
        
        # Find closest data point
        df['distance'] = df.apply(lambda row: haversine_distance(lat, lon, row['lat'], row['lon']), axis=1)
        closest = df.loc[df['distance'].idxmin()]
        return float(closest['aqi'])
    except:
        return 50.0  # Default moderate AQI
    """Get AQI for a location from dataset"""
    location_df = df[
        (df['lat'].between(lat - radius, lat + radius)) &
        (df['lon'].between(lon - radius, lon + radius))
    ]
    
    if len(location_df) == 0:
        # Use overall average if no match
        return float(df['aqi'].mean())
    
    return float(location_df['aqi'].mean())

@router.post("/travel-exposure")
async def calculate_travel_exposure(request: TravelRequest):
    """
    Calculate pollution exposure for a travel route with state-by-state analysis
    """
    try:
        # Get real-time AQI for source and destination
        source_aqi = get_real_time_aqi(request.source_lat, request.source_lon)
        dest_aqi = get_real_time_aqi(request.dest_lat, request.dest_lon)
        
        # Calculate total distance
        total_distance = haversine_distance(
            request.source_lat, request.source_lon,
            request.dest_lat, request.dest_lon
        )
        
        # Get states along the route
        states = get_states_along_route(
            request.source_lat, request.source_lon,
            request.dest_lat, request.dest_lon
        )
        
        # Calculate state-by-state breakdown
        state_breakdown = []
        for state in states:
            if state != "Unknown":
                # Sample multiple points within the state for average AQI
                state_lat = (request.source_lat + request.dest_lat) / 2  # Simplified
                state_lon = (request.source_lon + request.dest_lon) / 2
                state_aqi = get_real_time_aqi(state_lat, state_lon)
                
                # Estimate distance through this state (simplified)
                state_distance = total_distance / len(states)
                
                # Determine risk level for this state
                if state_aqi <= 50:
                    risk_level = "Low"
                elif state_aqi <= 100:
                    risk_level = "Moderate"
                elif state_aqi <= 150:
                    risk_level = "High"
                else:
                    risk_level = "Very High"
                
                state_breakdown.append(StateAnalysis(
                    state=state,
                    distance_km=round(state_distance, 1),
                    average_aqi=round(state_aqi, 1),
                    risk_level=risk_level
                ))
        
        # Calculate route average AQI
        if state_breakdown:
            route_average_aqi = sum(s.average_aqi for s in state_breakdown) / len(state_breakdown)
        else:
            route_average_aqi = (source_aqi + dest_aqi) / 2
        
        # Determine exposure level
        if route_average_aqi <= 50:
            exposure_level = "Low"
            risk_assessment = "Safe to travel"
        elif route_average_aqi <= 100:
            exposure_level = "Moderate"
            risk_assessment = "Generally safe, but sensitive individuals should take precautions"
        elif route_average_aqi <= 150:
            exposure_level = "High"
            risk_assessment = "Consider postponing travel or taking protective measures"
        elif route_average_aqi <= 200:
            exposure_level = "Very High"
            risk_assessment = "Avoid travel if possible, or use protective equipment"
        else:
            exposure_level = "Critical"
            risk_assessment = "Travel not recommended unless absolutely necessary"
        
        # Generate recommendations
        recommendations = []
        
        if route_average_aqi > 100:
            recommendations.append(f"Route average AQI is {route_average_aqi:.1f} - consider alternative routes or timing")
        
        if request.travel_mode == "walking" or request.travel_mode == "cycling":
            if route_average_aqi > 100:
                recommendations.append("Consider using a vehicle instead to reduce exposure time")
                recommendations.append("Wear N95 mask if walking/cycling is necessary")
        else:
            if route_average_aqi > 150:
                recommendations.append("Keep car windows closed and use recirculated air")
        
        if route_average_aqi > 150:
            recommendations.append("Plan travel during times when air quality is typically better (early morning)")
            recommendations.append("Consider postponing non-essential travel")
        
        if source_aqi > dest_aqi:
            recommendations.append(f"Destination has better air quality ({dest_aqi:.1f} vs {source_aqi:.1f})")
        elif dest_aqi > source_aqi:
            recommendations.append(f"Source has better air quality ({source_aqi:.1f} vs {dest_aqi:.1f})")
        
        recommendations.append(f"Travel distance: {distance:.1f} km")
        
        return TravelResponse(
            source_aqi=round(source_aqi, 1),
            dest_aqi=round(dest_aqi, 1),
            route_average_aqi=round(route_average_aqi, 1),
            exposure_level=exposure_level,
            risk_assessment=risk_assessment,
            recommendations=recommendations
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating travel exposure: {str(e)}")

