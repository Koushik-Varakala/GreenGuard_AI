"""
Health Recommendations API Routes
Provides personalized health and safety recommendations
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal

router = APIRouter(prefix="/api", tags=["Recommendations"])

class RecommendationRequest(BaseModel):
    aqi: float
    user_type: Literal["normal", "child", "elderly", "sensitive"]

class RecommendationResponse(BaseModel):
    recommendations: list
    risk_level: str
    outdoor_activity: str
    mask_required: bool
    air_purifier: bool

def get_aqi_category(aqi: float) -> str:
    """Categorize AQI value"""
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Moderate"
    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups"
    elif aqi <= 200:
        return "Unhealthy"
    elif aqi <= 300:
        return "Very Unhealthy"
    else:
        return "Hazardous"

@router.post("/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """
    Get personalized health recommendations based on AQI and user type
    """
    aqi = request.aqi
    user_type = request.user_type
    category = get_aqi_category(aqi)
    
    recommendations = []
    risk_level = "Low"
    outdoor_activity = "Safe"
    mask_required = False
    air_purifier = False
    
    # Base recommendations for all users
    if aqi <= 50:
        recommendations.append("Air quality is excellent. Enjoy outdoor activities!")
        recommendations.append("No special precautions needed.")
        risk_level = "Low"
        outdoor_activity = "Safe"
    
    elif aqi <= 100:
        recommendations.append("Air quality is acceptable for most people.")
        recommendations.append("Sensitive individuals may experience minor symptoms.")
        risk_level = "Low to Moderate"
        outdoor_activity = "Generally Safe"
        
        if user_type in ["child", "elderly", "sensitive"]:
            recommendations.append("Consider reducing prolonged outdoor activities.")
            mask_required = True
    
    elif aqi <= 150:
        recommendations.append("Sensitive groups should reduce outdoor activities.")
        recommendations.append("Everyone should avoid prolonged outdoor exertion.")
        risk_level = "Moderate to High"
        outdoor_activity = "Limit Outdoor Activities"
        mask_required = True
        
        if user_type in ["child", "elderly", "sensitive"]:
            recommendations.append("Stay indoors as much as possible.")
            recommendations.append("Use air purifiers if available.")
            air_purifier = True
    
    elif aqi <= 200:
        recommendations.append("Everyone should avoid outdoor activities.")
        recommendations.append("Keep windows and doors closed.")
        recommendations.append("Use air purifiers with HEPA filters.")
        risk_level = "High"
        outdoor_activity = "Avoid Outdoor Activities"
        mask_required = True
        air_purifier = True
        
        if user_type in ["child", "elderly", "sensitive"]:
            recommendations.append("Consider relocating to an area with better air quality if possible.")
            recommendations.append("Monitor for respiratory symptoms.")
    
    elif aqi <= 300:
        recommendations.append("HEALTH ALERT: Avoid all outdoor activities.")
        recommendations.append("Stay indoors with windows and doors closed.")
        recommendations.append("Use air purifiers continuously.")
        recommendations.append("Wear N95 masks if you must go outside.")
        risk_level = "Very High"
        outdoor_activity = "Avoid All Outdoor Activities"
        mask_required = True
        air_purifier = True
        
        if user_type in ["child", "elderly", "sensitive"]:
            recommendations.append("Consider evacuation to a safer area if possible.")
            recommendations.append("Seek medical attention if experiencing breathing difficulties.")
    
    else:  # Hazardous
        recommendations.append("EMERGENCY: Air quality is hazardous.")
        recommendations.append("Remain indoors at all times.")
        recommendations.append("Use air purifiers and seal all openings.")
        recommendations.append("Wear N95 masks if absolutely necessary to go outside.")
        recommendations.append("Consider temporary relocation.")
        risk_level = "Critical"
        outdoor_activity = "EMERGENCY - Stay Indoors"
        mask_required = True
        air_purifier = True
        
        if user_type in ["child", "elderly", "sensitive"]:
            recommendations.append("URGENT: Seek medical advice immediately if symptoms occur.")
            recommendations.append("Consider immediate relocation to a safer area.")
    
    # Respiratory health focus - Enhanced recommendations
    respiratory_warnings = []
    if aqi > 100:
        respiratory_warnings.append("⚠️ RESPIRATORY ALERT: High pollution levels detected")
        respiratory_warnings.append("People with asthma, COPD, or other respiratory conditions are at increased risk")
        respiratory_warnings.append("Monitor for: shortness of breath, chest tightness, coughing, wheezing")
        
    if aqi > 150:
        respiratory_warnings.append("🚨 CRITICAL: Respiratory patients should avoid all outdoor exposure")
        respiratory_warnings.append("Keep rescue inhalers and medications easily accessible")
        respiratory_warnings.append("Consider using a nebulizer if prescribed")
        respiratory_warnings.append("Watch for signs of respiratory distress - seek medical help if symptoms worsen")
    
    recommendations.extend(respiratory_warnings)
    
    # User-type specific recommendations
    if user_type == "child":
        recommendations.append("👶 CHILD-SPECIFIC: Children's lungs are still developing and more vulnerable")
        recommendations.append("Children breathe faster, inhaling more pollutants per body weight")
        recommendations.append("Monitor for: persistent cough, difficulty breathing, reduced activity levels")
        if aqi > 100:
            recommendations.append("Keep children indoors - cancel outdoor play and sports activities")
            recommendations.append("Ensure indoor air is filtered - use HEPA air purifiers in children's rooms")
            recommendations.append("Watch for signs of respiratory distress - seek pediatric care if needed")
        if aqi > 150:
            recommendations.append("🚨 URGENT: Children should not go outside - risk of severe respiratory issues")
            recommendations.append("Consider keeping children home from school if air quality is poor")
    
    elif user_type == "elderly":
        recommendations.append("👴 ELDERLY-SPECIFIC: Older adults have reduced lung capacity and weaker immune systems")
        recommendations.append("Higher risk of complications from air pollution exposure")
        recommendations.append("Monitor for: chest pain, irregular heartbeat, difficulty breathing, dizziness")
        if aqi > 100:
            recommendations.append("Avoid all outdoor activities - stay in well-ventilated, filtered indoor spaces")
            recommendations.append("Postpone non-essential medical appointments if travel requires outdoor exposure")
            recommendations.append("Ensure medications are up to date and easily accessible")
        if aqi > 150:
            recommendations.append("🚨 CRITICAL: Elderly should remain indoors - high risk of respiratory/cardiac complications")
    
    elif user_type == "sensitive":
        recommendations.append("🏥 RESPIRATORY PATIENT: Extra precautions required for respiratory conditions")
        recommendations.append("If you have asthma, COPD, bronchitis, or other lung conditions:")
        recommendations.append("• Keep rescue medications (inhalers, nebulizers) within easy reach")
        recommendations.append("• Follow your action plan - increase medication if prescribed")
        recommendations.append("• Monitor peak flow readings if you use a peak flow meter")
        if aqi > 100:
            recommendations.append("🚨 Avoid ALL outdoor activities - stay in filtered indoor environment")
            recommendations.append("Use air purifiers with HEPA filters in all living spaces")
            recommendations.append("Consider wearing N95 mask even indoors if air quality is very poor")
            recommendations.append("Contact your healthcare provider if you experience worsening symptoms")
        if aqi > 150:
            recommendations.append("🚨 EMERGENCY PROTOCOL: High risk of respiratory attack or exacerbation")
            recommendations.append("Have emergency contact numbers ready")
            recommendations.append("Consider relocating to area with better air quality if possible")
            recommendations.append("Seek immediate medical attention if experiencing: severe shortness of breath, chest pain, or inability to speak in full sentences")
    
    return RecommendationResponse(
        recommendations=recommendations,
        risk_level=risk_level,
        outdoor_activity=outdoor_activity,
        mask_required=mask_required,
        air_purifier=air_purifier
    )

