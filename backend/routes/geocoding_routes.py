"""
Geocoding API Routes
Converts location names to coordinates
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Dict

router = APIRouter(prefix="/api", tags=["Geocoding"])

# Location database (in production, use Google Geocoding API)
LOCATION_DB = {
    "hyderabad": {"lat": 17.3850, "lon": 78.4867, "city": "Hyderabad", "country": "India"},
    "ladakh": {"lat": 34.1526, "lon": 77.5771, "city": "Leh, Ladakh", "country": "India"},
    "leh": {"lat": 34.1526, "lon": 77.5771, "city": "Leh", "country": "India"},
    "delhi": {"lat": 28.6139, "lon": 77.2090, "city": "Delhi", "country": "India"},
    "new delhi": {"lat": 28.6139, "lon": 77.2090, "city": "New Delhi", "country": "India"},
    "mumbai": {"lat": 19.0760, "lon": 72.8777, "city": "Mumbai", "country": "India"},
    "bangalore": {"lat": 12.9716, "lon": 77.5946, "city": "Bangalore", "country": "India"},
    "chennai": {"lat": 13.0827, "lon": 80.2707, "city": "Chennai", "country": "India"},
    "kolkata": {"lat": 22.5726, "lon": 88.3639, "city": "Kolkata", "country": "India"},
    "pune": {"lat": 18.5204, "lon": 73.8567, "city": "Pune", "country": "India"},
    "manali": {"lat": 32.2396, "lon": 77.1887, "city": "Manali", "country": "India"},
    "shimla": {"lat": 31.1048, "lon": 77.1734, "city": "Shimla", "country": "India"},
    "darjeeling": {"lat": 27.0360, "lon": 88.2627, "city": "Darjeeling", "country": "India"},
    "srinagar": {"lat": 34.0837, "lon": 74.7973, "city": "Srinagar", "country": "India"},
}

class GeocodeResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    city: str
    country: str

@router.get("/geocode")
async def geocode_location(
    location: str = Query(..., description="Location name (e.g., 'Hyderabad', 'Ladakh')")
):
    """
    Convert location name to coordinates
    In production, this would use Google Geocoding API
    """
    location_lower = location.lower().strip()
    
    # Try exact match
    if location_lower in LOCATION_DB:
        data = LOCATION_DB[location_lower]
        return GeocodeResponse(
            location=location,
            latitude=data["lat"],
            longitude=data["lon"],
            city=data["city"],
            country=data["country"]
        )
    
    # Try partial match
    for key, data in LOCATION_DB.items():
        if key in location_lower or location_lower in key:
            return GeocodeResponse(
                location=location,
                latitude=data["lat"],
                longitude=data["lon"],
                city=data["city"],
                country=data["country"]
            )
    
    # Default to Hyderabad if not found
    default = LOCATION_DB["hyderabad"]
    return GeocodeResponse(
        location=location,
        latitude=default["lat"],
        longitude=default["lon"],
        city=default["city"],
        country=default["country"]
    )



