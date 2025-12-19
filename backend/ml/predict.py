"""
AQI Prediction Module
Loads trained model and makes predictions for 1-7 days ahead
"""

import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime, timedelta

class AQIPredictor:
    def __init__(self):
        """Initialize predictor with trained model"""
        self.model = None
        self.feature_names = None
        self.load_model()
    
    def load_model(self):
        """Load trained XGBoost model and feature names"""
        model_path = os.path.join(os.path.dirname(__file__), 'aqi_model.pkl')
        feature_path = os.path.join(os.path.dirname(__file__), 'feature_names.pkl')
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}. Please train the model first.")
        
        self.model = joblib.load(model_path)
        self.feature_names = joblib.load(feature_path)
    
    def prepare_features(self, historical_data, target_date):
        """
        Prepare features for prediction
        
        Args:
            historical_data: DataFrame with historical AQI data
            target_date: datetime object for prediction date
        
        Returns:
            Feature array ready for prediction
        """
        # Create date features
        day = target_date.day
        month = target_date.month
        weekday = target_date.weekday()
        
        # Get lag features from historical data
        if len(historical_data) >= 3:
            aqi_lag_1 = historical_data['aqi'].iloc[-1] if len(historical_data) > 0 else 100
            aqi_lag_2 = historical_data['aqi'].iloc[-2] if len(historical_data) > 1 else 100
            aqi_lag_3 = historical_data['aqi'].iloc[-3] if len(historical_data) > 2 else 100
        else:
            # Use mean if not enough history
            mean_aqi = historical_data['aqi'].mean() if len(historical_data) > 0 else 100
            aqi_lag_1 = historical_data['aqi'].iloc[-1] if len(historical_data) > 0 else mean_aqi
            aqi_lag_2 = mean_aqi
            aqi_lag_3 = mean_aqi
        
        # Get environmental features (use latest available or mean)
        pm25 = historical_data['pm25'].iloc[-1] if len(historical_data) > 0 and 'pm25' in historical_data.columns else 50
        pm10 = historical_data['pm10'].iloc[-1] if len(historical_data) > 0 and 'pm10' in historical_data.columns else 70
        co2 = historical_data['co2'].iloc[-1] if len(historical_data) > 0 and 'co2' in historical_data.columns else 400
        temperature = historical_data['temperature'].iloc[-1] if len(historical_data) > 0 and 'temperature' in historical_data.columns else 25
        humidity = historical_data['humidity'].iloc[-1] if len(historical_data) > 0 and 'humidity' in historical_data.columns else 60
        wind_speed = historical_data['wind_speed'].iloc[-1] if len(historical_data) > 0 and 'wind_speed' in historical_data.columns else 3
        
        # Create feature dictionary
        features = {
            'day': day,
            'month': month,
            'weekday': weekday,
            'aqi_lag_1': aqi_lag_1,
            'aqi_lag_2': aqi_lag_2,
            'aqi_lag_3': aqi_lag_3,
            'pm25': pm25,
            'pm10': pm10,
            'co2': co2,
            'temperature': temperature,
            'humidity': humidity,
            'wind_speed': wind_speed
        }
        
        # Convert to array in correct order
        feature_array = np.array([features.get(name, 0) for name in self.feature_names])
        return feature_array.reshape(1, -1)
    
    def predict(self, historical_data, days_ahead=7):
        """
        Predict AQI for next N days
        
        Args:
            historical_data: DataFrame with historical AQI data (must have 'date' and 'aqi' columns)
            days_ahead: Number of days to predict (default: 7)
        
        Returns:
            List of predictions with dates
        """
        if self.model is None:
            raise ValueError("Model not loaded. Call load_model() first.")
        
        predictions = []
        current_data = historical_data.copy()
        
        # Ensure date column is datetime
        if 'date' in current_data.columns:
            current_data['date'] = pd.to_datetime(current_data['date'])
            last_date = current_data['date'].max()
        else:
            last_date = datetime.now()
        
        for i in range(1, days_ahead + 1):
            target_date = last_date + timedelta(days=i)
            
            # Prepare features
            features = self.prepare_features(current_data, target_date)
            
            # Predict
            aqi_pred = self.model.predict(features)[0]
            aqi_pred = max(0, aqi_pred)  # Ensure non-negative
            
            predictions.append({
                'date': target_date.strftime('%Y-%m-%d'),
                'aqi': round(float(aqi_pred), 1)
            })
            
            # Update historical data with prediction for next iteration
            new_row = current_data.iloc[-1].copy() if len(current_data) > 0 else pd.Series()
            new_row['date'] = target_date
            new_row['aqi'] = aqi_pred
            current_data = pd.concat([current_data, pd.DataFrame([new_row])], ignore_index=True)
        
        return predictions

