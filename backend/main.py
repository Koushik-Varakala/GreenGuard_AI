"""
GreenGuard AI - Main FastAPI Application
Environmental monitoring and pollution prevention system
"""

import sys
import os
from pathlib import Path

# Add current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from routes import aqi_routes, recommendations_routes, travel_routes, geocoding_routes, agent_routes, personalized_recommendations_routes
import asyncio
import json
from datetime import datetime
import random

app = FastAPI(
    title="GreenGuard AI API",
    description="AI-powered environmental monitoring and pollution prevention system",
    version="1.0.0"
)

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for env-safety-agent
env_safety_path = current_dir / ".adk" / "artifacts" / "env-safety-agent" / "env-safety-agent" / "dist"
if env_safety_path.exists():
    app.mount("/env-safety-agent", StaticFiles(directory=str(env_safety_path), html=True), name="env-safety-agent")

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove broken connections
                self.active_connections.remove(connection)

manager = ConnectionManager()

# Include routers
app.include_router(aqi_routes.router)
app.include_router(recommendations_routes.router)
app.include_router(travel_routes.router)
app.include_router(geocoding_routes.router)
app.include_router(agent_routes.router)
app.include_router(personalized_recommendations_routes.router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "GreenGuard AI API",
        "version": "1.0.0",
        "endpoints": {
            "current_aqi": "/api/current-aqi?latitude=<lat>&longitude=<lon>",
            "forecast": "/api/forecast?latitude=<lat>&longitude=<lon>&days=7",
            "recommendations": "/api/recommendations (POST)",
            "travel_exposure": "/api/travel-exposure (POST)"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.websocket("/ws/realtime-monitoring")
async def realtime_monitoring(websocket: WebSocket, latitude: float = 40.7128, longitude: float = -74.006):
    """
    WebSocket endpoint for real-time environmental monitoring
    Streams live AQI, weather, and air quality data updates
    """
    await manager.connect(websocket)
    try:
        # Send initial connection message
        await websocket.send_json({
            "type": "connection_established",
            "message": "Real-time monitoring connected",
            "timestamp": datetime.now().isoformat()
        })

        while True:
            try:
                # Get real-time data
                from services.weather_service import get_weather_data
                from services.air_quality_service import get_current_aqi as get_aqi_data

                # Fetch current weather and AQI data
                weather_data = get_weather_data(latitude, longitude)
                aqi_data = get_aqi_data(latitude, longitude)

                # Create real-time data packet
                realtime_data = {
                    "type": "realtime_update",
                    "timestamp": datetime.now().isoformat(),
                    "location": {
                        "latitude": latitude,
                        "longitude": longitude
                    },
                    "aqi": {
                        "value": aqi_data.get("aqi", 50) if "error" not in aqi_data else 50,
                        "status": "Good" if (aqi_data.get("aqi", 50) if "error" not in aqi_data else 50) <= 50 else
                                "Moderate" if (aqi_data.get("aqi", 50) if "error" not in aqi_data else 50) <= 100 else "Unhealthy",
                        "pm25": aqi_data.get("pm25", 0),
                        "pm10": aqi_data.get("pm10", 0)
                    },
                    "weather": {
                        "temperature": weather_data.get("temperature", 22),
                        "humidity": weather_data.get("humidity", 60),
                        "wind_speed": weather_data.get("wind_speed", 5),
                        "description": weather_data.get("description", "Clear sky")
                    },
                    "alerts": []
                }

                # Add alerts based on conditions
                aqi_value = realtime_data["aqi"]["value"]
                if aqi_value > 150:
                    realtime_data["alerts"].append({
                        "level": "danger",
                        "message": "Very unhealthy air quality - avoid outdoor activities"
                    })
                elif aqi_value > 100:
                    realtime_data["alerts"].append({
                        "level": "warning",
                        "message": "Unhealthy air quality for sensitive groups"
                    })

                # Send data to client
                try:
                    await websocket.send_json(realtime_data)
                except WebSocketDisconnect:
                    break

                # Wait 15 seconds before next update (reduced from 30 for better responsiveness)
                await asyncio.sleep(15)

            except WebSocketDisconnect:
                # Client disconnected, break out of the loop
                break
            except Exception as e:
                try:
                    await websocket.send_json({
                        "type": "error",
                        "message": f"Data fetch error: {str(e)}",
                        "timestamp": datetime.now().isoformat()
                    })
                except WebSocketDisconnect:
                    break
                await asyncio.sleep(10)  # Retry after error

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"Client disconnected from real-time monitoring")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8020)

