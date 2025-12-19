"""
Personalized recommendations routes
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List

router = APIRouter(
    prefix="/api/personalized-recommendations",
    tags=["Personalized Recommendations"]
)

class HealthData(BaseModel):
    age: int
    conditions: List[str]

class Location(BaseModel):
    latitude: float
    longitude: float

class PersonalizedRecommendationsRequest(BaseModel):
    health_data: HealthData
    location: Location

@router.post("/")
async def get_personalized_recommendations(request: PersonalizedRecommendationsRequest):
    """
    Get personalized environmental safety recommendations based on health data and location.
    """
    # For now, return a dummy response
    return {
        "recommendations": [
            "Avoid strenuous outdoor activities today.",
            "Keep windows closed to prevent indoor air pollution.",
            "Use an air purifier if you have one."
        ]
    }
