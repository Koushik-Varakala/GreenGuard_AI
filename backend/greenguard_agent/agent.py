import json

class GreenGuardAI:
    """
    GreenGuard AI: Autonomous environmental safety and travel guidance agent.

    Analyzes environmental data to provide safety recommendations and travel guidance.
    """

    def __init__(self):
        pass

    def analyze_conditions(self, aqi, co2_ppm, wind_speed_ms, travel_context=None):
        """
        Analyze environmental conditions and provide travel guidance.

        Args:
            aqi (float): Air Quality Index
            co2_ppm (float): CO₂ concentration in ppm
            wind_speed_ms (float): Wind speed in m/s
            travel_context (str, optional): Route or travel context

        Returns:
            dict: Analysis results in specified JSON format
        """
        # Interpret AQI severity
        if aqi < 50:
            aqi_level = "Good"
        elif aqi <= 100:
            aqi_level = "Moderate"
        elif aqi <= 150:
            aqi_level = "Unhealthy"
        else:
            aqi_level = "Hazardous"

        # Interpret wind conditions
        if wind_speed_ms < 2:
            wind_condition = "stagnation"
        elif wind_speed_ms <= 5:
            wind_condition = "partial_dispersion"
        else:
            wind_condition = "good_dispersion"

        # Evaluate CO₂ concentration
        if co2_ppm <= 450:
            co2_level = "normal"
        else:
            co2_level = "elevated"

        # Estimate air freshness
        if aqi_level in ["Good", "Moderate"] and co2_level == "normal" and wind_condition in ["partial_dispersion", "good_dispersion"]:
            air_freshness = "Good"
        elif aqi_level == "Unhealthy" or co2_level == "elevated" or wind_condition == "stagnation":
            air_freshness = "Poor"
        else:
            air_freshness = "Moderate"

        # Assess travel risk
        risk_factors = 0
        if aqi_level in ["Unhealthy", "Hazardous"]:
            risk_factors += 2
        elif aqi_level == "Moderate":
            risk_factors += 1

        if co2_level == "elevated":
            risk_factors += 1

        if wind_condition == "stagnation":
            risk_factors += 1

        if risk_factors >= 3:
            travel_risk = "High"
        elif risk_factors >= 1:
            travel_risk = "Medium"
        else:
            travel_risk = "Low"

        # Determine recommended action
        if travel_risk == "High":
            recommended_action = "Delay Travel"
        elif travel_risk == "Medium":
            recommended_action = "Change Route"
        else:
            recommended_action = "Continue Travel"

        # Generate precautions
        precautions = []
        if aqi_level in ["Unhealthy", "Hazardous"]:
            precautions.append("Wear N95 mask")
            precautions.append("Reduce outdoor exposure")

        if wind_condition == "stagnation":
            precautions.append("Pause in green area for 10 minutes")

        if travel_context and "traffic" in travel_context.lower():
            precautions.append("Avoid high-traffic zones")

        if not precautions:
            precautions.append("Monitor conditions regularly")

        # Create reasoning
        reasoning_parts = []
        reasoning_parts.append(f"AQI {aqi} indicates {aqi_level.lower()} air quality")
        reasoning_parts.append(f"CO₂ at {co2_ppm} ppm with {wind_condition.replace('_', ' ')}")
        reasoning_parts.append(f"Overall risk assessment: {travel_risk.lower()}")

        reasoning = ". ".join(reasoning_parts)

        return {
            "aqi_level": aqi_level,
            "air_freshness": air_freshness,
            "travel_risk": travel_risk,
            "recommended_action": recommended_action,
            "precautions": precautions,
            "reasoning": reasoning
        }

    def get_analysis_json(self, aqi, co2_ppm, wind_speed_ms, travel_context=None):
        """
        Get analysis results as JSON string.
        """
        result = self.analyze_conditions(aqi, co2_ppm, wind_speed_ms, travel_context)
        return json.dumps(result, indent=2)
