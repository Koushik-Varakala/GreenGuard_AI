/**
 * API Service for GreenGuard AI
 * Handles all backend API calls
 */

import axios from 'axios';
import { apiCache } from './cache';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8020';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

export const aqiAPI = {
  // Get current AQI for a location
  getCurrentAQI: async (latitude, longitude) => {
    const cacheKey = `current-aqi-${latitude}-${longitude}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const response = await api.get('/api/current-aqi', {
      params: { latitude, longitude },
    });
    apiCache.set(cacheKey, response.data);
    return response.data;
  },

  // Get forecast
  getForecast: async (latitude, longitude, days = 7) => {
    const cacheKey = `forecast-${latitude}-${longitude}-${days}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const response = await api.get('/api/forecast', {
      params: { latitude, longitude, days },
    });
    apiCache.set(cacheKey, response.data);
    return response.data;
    return response.data;
  },

  // Get recommendations
  getRecommendations: async (aqi, userType) => {
    const response = await api.post('/api/recommendations', {
      aqi,
      user_type: userType,
    });
    return response.data;
  },

  // Calculate travel exposure
  calculateTravelExposure: async (sourceLat, sourceLon, destLat, destLon, travelMode = 'driving') => {
    const response = await api.post('/api/travel-exposure', {
      source_lat: sourceLat,
      source_lon: sourceLon,
      dest_lat: destLat,
      dest_lon: destLon,
      travel_mode: travelMode,
    });
    return response.data;
  },

  // Get historical data (last 6 months)
  getHistoricalData: async (latitude, longitude) => {
    const response = await api.get('/api/historical', {
      params: { latitude, longitude },
    });
    return response.data;
  },

  // Geocode location name to coordinates
  geocodeLocation: async (locationName) => {
    const response = await api.get('/api/geocode', {
      params: { location: locationName },
    });
    return response.data;
  },
};

export default api;

