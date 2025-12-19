# GreenGuard AI Agent

## Overview

GreenGuard AI is an autonomous environmental safety and travel guidance agent that analyzes real-time environmental conditions to provide safety recommendations and travel guidance.

## Features

- **Real-time Environmental Analysis**: Analyzes AQI, CO₂ concentration, and wind speed
- **Travel Risk Assessment**: Evaluates pollution risk during travel
- **Safety Recommendations**: Provides actionable precautions based on conditions
- **Travel Guidance**: Makes decisions about travel safety and suggests alternatives

## API Endpoints

### POST /api/analyze-conditions

Analyze environmental conditions and provide travel guidance.

**Request Body:**
```json
{
  "aqi": 75.0,
  "co2_ppm": 420.0,
  "wind_speed_ms": 3.5,
  "travel_context": "urban driving"
}
```

**Response:**
```json
{
  "aqi_level": "Moderate",
  "air_freshness": "Good",
  "travel_risk": "Medium",
  "recommended_action": "Change Route",
  "precautions": ["Monitor conditions regularly"],
  "reasoning": "AQI 75 indicates moderate air quality. CO₂ at 420 ppm with partial dispersion. Overall risk assessment: medium"
}
```

### GET /api/agent-status

Get the status and capabilities of the GreenGuard AI agent.

## Usage Examples

### Low Risk Scenario (Good Conditions)
- AQI: 35 (Good)
- CO₂: 410 ppm (Normal)
- Wind: 4.2 m/s (Partial dispersion)
- Result: Continue Travel, Low Risk

### High Risk Scenario (Hazardous Conditions)
- AQI: 180 (Hazardous)
- CO₂: 500 ppm (Elevated)
- Wind: 1.5 m/s (Stagnation)
- Result: Delay Travel, High Risk, Multiple precautions recommended

## Decision Logic

The agent uses the following criteria:

- **AQI Levels**: Good (<50), Moderate (50-100), Unhealthy (100-150), Hazardous (>150)
- **Wind Conditions**: Stagnation (<2 m/s), Partial dispersion (2-5 m/s), Good dispersion (>5 m/s)
- **CO₂ Levels**: Normal (≤450 ppm), Elevated (>450 ppm)
- **Air Freshness**: Good/Moderate/Poor based on combined factors
- **Travel Risk**: Low/Medium/High based on risk factors
- **Actions**: Continue Travel, Change Route, Delay Travel

## Safety Priority

User safety is prioritized over clarity and speed. The agent optimizes for fast, reliable decision-making while ensuring conservative recommendations for hazardous conditions.