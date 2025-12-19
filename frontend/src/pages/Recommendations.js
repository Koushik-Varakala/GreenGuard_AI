import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Recommendations = () => {
  const [aqi, setAqi] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAqiData, setCurrentAqiData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [manualMode, setManualMode] = useState(false);

  /* ------------------ Helper: Breeze Level ------------------ */
  const getBreezeLevel = (windSpeed) => {
    if (windSpeed < 1) return 'Calm';
    if (windSpeed < 5) return 'Light Breeze';
    if (windSpeed < 10) return 'Moderate Breeze';
    return 'Strong Wind';
  };

  const getRecommendationsForAQI = useCallback(async (aqiValue) => {
    try {
      const response = await axios.post('http://localhost:8020/api/recommendations', {
        aqi: parseFloat(aqiValue),
        user_type: 'normal'
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setRecommendations({ error: 'Failed to get recommendations' });
    }
  }, []);

  const detectLocationAndFetchAQI = useCallback(() => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get location name
          try {
            const geoResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const geoData = await geoResponse.json();
            const locationName = geoData.locality || geoData.city || geoData.principalSubdivision || 
                               `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
            
            setCurrentLocation({
              name: locationName,
              lat: latitude,
              lon: longitude
            });

            // Fetch AQI data
            try {
              const aqiResponse = await axios.get(
                `http://localhost:8020/api/current-aqi?latitude=${latitude}&longitude=${longitude}`
              );
              const data = aqiResponse.data;
              const breeze = getBreezeLevel(data.wind_speed || 0);
              setCurrentAqiData({
                ...data,
                breeze
              });
              setAqi(data.aqi.toString());
              
              // Auto-get recommendations
              await getRecommendationsForAQI(data.aqi);
            } catch (error) {
              console.error('Error fetching AQI:', error);
              setCurrentAqiData({ error: 'Failed to fetch air quality data' });
            }
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            setCurrentLocation({
              name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
              lat: latitude,
              lon: longitude
            });
          }
          
          setLocationLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setCurrentLocation({ error: 'Location access denied. Please enable location services.' });
          setLocationLoading(false);
        }
      );
    } else {
      setCurrentLocation({ error: 'Geolocation is not supported by this browser.' });
      setLocationLoading(false);
    }
  }, [getRecommendationsForAQI]);

  // Auto-detect location and fetch AQI on component mount
  useEffect(() => {
    if (!manualMode) {
      detectLocationAndFetchAQI();
    }
  }, [manualMode, detectLocationAndFetchAQI]);

  const handleGetRecommendations = async () => {
    if (!aqi) return;
    setLoading(true);
    await getRecommendationsForAQI(aqi);
    setLoading(false);
  };

  const refreshData = () => {
    if (!manualMode) {
      detectLocationAndFetchAQI();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🛡️ Health & Safety Recommendations</h1>
          <p className="text-gray-600">Get personalized advice based on air quality</p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Detection Mode</h3>
              <p className="text-sm text-gray-500">
                {manualMode ? 'Manual AQI input' : 'Auto-detect location and AQI'}
              </p>
            </div>
            <label className="flex items-center cursor-pointer">
              <span className="mr-3 text-sm font-medium text-gray-700">
                {manualMode ? 'Manual' : 'Auto'}
              </span>
              <div className={`relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full ${
                manualMode ? 'bg-gray-300' : 'bg-purple-600'
              }`}>
                <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                  manualMode ? 'translate-x-6' : 'translate-x-0'
                }`}></span>
              </div>
              <input
                type="checkbox"
                checked={manualMode}
                onChange={() => setManualMode(!manualMode)}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {/* Location and AQI Display */}
        {!manualMode && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">📍 Current Location & Air Quality</h3>
              <button
                onClick={refreshData}
                className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
                disabled={locationLoading}
              >
                <span className="mr-2">🔄</span>
                Refresh
              </button>
            </div>

            {locationLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mr-3"></div>
                <span className="text-gray-600">Detecting location...</span>
              </div>
            ) : currentLocation?.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{currentLocation.error}</p>
                <button
                  onClick={() => setManualMode(true)}
                  className="mt-2 text-purple-600 hover:text-purple-800 underline"
                >
                  Switch to manual input
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">📍 Location</h4>
                  <p className="text-lg text-gray-800">{currentLocation?.name}</p>
                  <p className="text-sm text-gray-500">
                    {currentLocation?.lat?.toFixed(4)}, {currentLocation?.lon?.toFixed(4)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">🌬️ Current AQI</h4>
                  {currentAqiData?.error ? (
                    <p className="text-red-600">{currentAqiData.error}</p>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-purple-600">{currentAqiData?.aqi}</p>
                      <p className="text-sm text-gray-500">Air Quality Index</p>
                    </>
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">💨 Wind & Breeze</h4>
                  {currentAqiData?.error ? (
                    <p className="text-red-600">N/A</p>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-blue-600">{currentAqiData?.wind_speed || 0} m/s</p>
                      <p className="text-sm text-gray-500">{currentAqiData?.breeze || 'Unknown'}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Input Section */}
        {manualMode && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">🌬️ Current AQI Level</label>
                <input
                  type="number"
                  value={aqi}
                  onChange={(e) => setAqi(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="e.g. 75"
                />
              </div>
              <button
                onClick={handleGetRecommendations}
                className="bg-purple-600 text-white py-3 px-8 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={loading || !aqi}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💡</span>
                    Get Recommendations
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {recommendations && !recommendations.error && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Personalized Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">📋 Recommendations</h3>
                <ul className="space-y-2">
                  {recommendations.recommendations && recommendations.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">⚠️ Risk Assessment</h3>
                  <p className="text-2xl font-bold mb-2">
                    <span className={`${
                      recommendations.risk_level === 'Low' ? 'text-green-600' :
                      recommendations.risk_level === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {recommendations.risk_level}
                    </span>
                  </p>
                  <p className="text-gray-600">Overall risk level</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">{recommendations.outdoor_activity === 'Safe' ? '✅' : '❌'}</div>
                    <p className="text-sm font-medium text-gray-700">Outdoor Activity</p>
                    <p className="text-xs text-gray-500">{recommendations.outdoor_activity}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">{recommendations.mask_required ? '😷' : '🙂'}</div>
                    <p className="text-sm font-medium text-gray-700">Mask Required</p>
                    <p className="text-xs text-gray-500">{recommendations.mask_required ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">{recommendations.air_purifier ? '🏠' : '🚫'}</div>
                    <p className="text-sm font-medium text-gray-700">Air Purifier</p>
                    <p className="text-xs text-gray-500">{recommendations.air_purifier ? 'Recommended' : 'Not needed'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🏃</div>
                    <p className="text-sm font-medium text-gray-700">Activity Level</p>
                    <p className="text-xs text-gray-500">Monitor closely</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {recommendations && recommendations.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">❌</span>
              <span className="font-medium">{recommendations.error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;