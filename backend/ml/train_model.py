"""
XGBoost Model Training for AQI Prediction
Trains a model to predict AQI for the next 1-7 days
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import xgboost as xgb
import joblib
import os
from datetime import datetime, timedelta

def load_data(file_path):
    """Load air quality data from CSV"""
    df = pd.read_csv(file_path)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)
    return df

def create_features(df):
    """
    Feature Engineering:
    - Date features: day, month, weekday
    - Lag features: aqi_lag_1, aqi_lag_2, aqi_lag_3
    - Environmental features: pm25, pm10, co2, temperature, humidity, wind_speed
    """
    df = df.copy()
    
    # Date features
    df['day'] = df['date'].dt.day
    df['month'] = df['date'].dt.month
    df['weekday'] = df['date'].dt.weekday
    
    # Lag features (previous days' AQI)
    df['aqi_lag_1'] = df['aqi'].shift(1)
    df['aqi_lag_2'] = df['aqi'].shift(2)
    df['aqi_lag_3'] = df['aqi'].shift(3)
    
    # Fill NaN values in lag features with forward fill
    df['aqi_lag_1'] = df['aqi_lag_1'].ffill().fillna(df['aqi'].mean())
    df['aqi_lag_2'] = df['aqi_lag_2'].ffill().fillna(df['aqi'].mean())
    df['aqi_lag_3'] = df['aqi_lag_3'].ffill().fillna(df['aqi'].mean())
    
    # Handle missing values in other features
    numeric_cols = ['pm25', 'pm10', 'co2', 'temperature', 'humidity', 'wind_speed']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = df[col].fillna(df[col].mean())
    
    return df

def prepare_training_data(df):
    """Prepare features and target for training"""
    feature_cols = [
        'day', 'month', 'weekday',
        'aqi_lag_1', 'aqi_lag_2', 'aqi_lag_3',
        'pm25', 'pm10', 'co2',
        'temperature', 'humidity', 'wind_speed'
    ]
    
    # Ensure all feature columns exist
    available_features = [col for col in feature_cols if col in df.columns]
    
    X = df[available_features].copy()
    y = df['aqi'].copy()
    
    # Remove rows with NaN in target
    valid_idx = ~y.isna()
    X = X[valid_idx]
    y = y[valid_idx]
    
    return X, y, available_features

def train_model(X_train, y_train, X_val, y_val):
    """Train XGBoost Regressor model"""
    model = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        n_jobs=-1,
        early_stopping_rounds=20
    )
    
    model.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        verbose=False
    )
    
    return model

def evaluate_model(model, X_test, y_test):
    """Evaluate model performance"""
    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    return rmse, r2, y_pred

def main():
    """Main training pipeline"""
    print("=" * 50)
    print("GreenGuard AI - Model Training")
    print("=" * 50)
    
    # Paths
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'air_quality_data.csv')
    model_path = os.path.join(os.path.dirname(__file__), 'aqi_model.pkl')
    feature_path = os.path.join(os.path.dirname(__file__), 'feature_names.pkl')
    
    # Load data
    print("\n[1/5] Loading data...")
    df = load_data(data_path)
    print(f"Loaded {len(df)} records")
    
    # Feature engineering
    print("\n[2/5] Creating features...")
    df = create_features(df)
    print("Features created successfully")
    
    # Prepare training data
    print("\n[3/5] Preparing training data...")
    X, y, feature_names = prepare_training_data(df)
    print(f"Features: {feature_names}")
    print(f"Training samples: {len(X)}")
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, shuffle=False
    )
    
    # Further split training data for validation
    X_train_split, X_val, y_train_split, y_val = train_test_split(
        X_train, y_train, test_size=0.2, random_state=42, shuffle=False
    )
    
    # Train model
    print("\n[4/5] Training XGBoost model...")
    model = train_model(X_train_split, y_train_split, X_val, y_val)
    print("Model trained successfully")
    
    # Evaluate
    print("\n[5/5] Evaluating model...")
    rmse, r2, y_pred = evaluate_model(model, X_test, y_test)
    print(f"\nModel Performance:")
    print(f"  RMSE: {rmse:.2f}")
    print(f"  R² Score: {r2:.4f}")
    
    if r2 >= 0.85:
        print("[SUCCESS] Model meets quality requirement (R² >= 0.85)")
    else:
        print("[WARNING] Model R² score below 0.85")
    
    # Save model and feature names
    print("\nSaving model...")
    joblib.dump(model, model_path)
    joblib.dump(feature_names, feature_path)
    print(f"Model saved to: {model_path}")
    print(f"Feature names saved to: {feature_path}")
    
    print("\n" + "=" * 50)
    print("Training completed successfully!")
    print("=" * 50)

if __name__ == "__main__":
    main()

