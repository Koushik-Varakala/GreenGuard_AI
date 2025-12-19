"""
GreenGuard AI Agent API Routes
Provides autonomous environmental safety and travel guidance
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from greenguard_agent.agent import GreenGuardAI

router = APIRouter(prefix="/api", tags=["GreenGuard AI"])

class AnalysisRequest(BaseModel):
    aqi: float
    co2_ppm: float
    wind_speed_ms: float
    travel_context: Optional[str] = None

class AnalysisResponse(BaseModel):
    aqi_level: str
    air_freshness: str
    travel_risk: str
    recommended_action: str
    precautions: list
    reasoning: str

# Initialize the agent
agent = GreenGuardAI()

@router.post("/analyze-conditions", response_model=AnalysisResponse)
async def analyze_environmental_conditions(request: AnalysisRequest):
    """
    Analyze environmental conditions and provide travel guidance.

    Takes AQI, CO₂ concentration, wind speed, and optional travel context
    to provide safety recommendations and travel decisions.
    """
    try:
        result = agent.analyze_conditions(
            aqi=request.aqi,
            co2_ppm=request.co2_ppm,
            wind_speed_ms=request.wind_speed_ms,
            travel_context=request.travel_context
        )
        return AnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/agent-status")
async def get_agent_status():
    """
    Get the status of the GreenGuard AI agent.
    """
    return {
        "status": "active",
        "agent": "GreenGuard AI",
        "version": "1.0.0",
        "capabilities": [
            "Environmental condition analysis",
            "Travel risk assessment",
            "Safety recommendations",
            "Real-time monitoring guidance"
        ]
    }