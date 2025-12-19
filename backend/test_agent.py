#!/usr/bin/env python3
"""
GreenGuard AI Agent Test Script
Demonstrates the autonomous environmental safety and travel guidance agent
"""

import json
from greenguard_agent.agent import GreenGuardAI

def test_scenarios():
    """Test various environmental scenarios"""
    agent = GreenGuardAI()

    scenarios = [
        {
            "name": "Good Conditions",
            "aqi": 35,
            "co2_ppm": 410,
            "wind_speed_ms": 4.2,
            "travel_context": "park walking"
        },
        {
            "name": "Moderate Conditions",
            "aqi": 75,
            "co2_ppm": 420,
            "wind_speed_ms": 3.5,
            "travel_context": "urban driving"
        },
        {
            "name": "Unhealthy Conditions",
            "aqi": 120,
            "co2_ppm": 460,
            "wind_speed_ms": 2.8,
            "travel_context": "industrial area"
        },
        {
            "name": "Hazardous Conditions",
            "aqi": 180,
            "co2_ppm": 500,
            "wind_speed_ms": 1.5,
            "travel_context": "high traffic area"
        }
    ]

    print("GreenGuard AI Agent Test Results")
    print("=" * 50)

    for scenario in scenarios:
        print(f"\nScenario: {scenario['name']}")
        print(f"Input: AQI={scenario['aqi']}, CO₂={scenario['co2_ppm']}ppm, Wind={scenario['wind_speed_ms']}m/s")
        print(f"Context: {scenario['travel_context']}")

        result = agent.analyze_conditions(
            aqi=scenario['aqi'],
            co2_ppm=scenario['co2_ppm'],
            wind_speed_ms=scenario['wind_speed_ms'],
            travel_context=scenario['travel_context']
        )

        print("Analysis:")
        print(json.dumps(result, indent=2))
        print("-" * 30)

if __name__ == "__main__":
    test_scenarios()