import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AQIGaugeChart from '../components/AQIGaugeChart';
import AirQualityRadarChart from '../components/AirQualityRadarChart';
import RealTimeMonitor from '../components/RealTimeMonitor';
import axios from 'axios';

const Dashboard = () => {
  const [currentData, setCurrentData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleRealtimeDataUpdate = (data) => {
    // Update current data with manual values
    if (currentData) {
      setCurrentData({
        ...currentData,
        temperature: data.temperature,
        humidity: data.humidity,
        wind_speed: data.windSpeed,
        pm25: data.pm25,
        pm10: data.pm10,
        co2: data.co2,
        aqi: Math.round((data.pm25 * 5 + data.pm10 * 2 + data.co2 * 0.1) / 3) // Simple AQI calculation
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock current location, in real get geolocation
        const lat = 40.7128;
        const lon = -74.0060;
        const response = await axios.get(`http://localhost:8020/api/current-aqi?latitude=${lat}&longitude=${lon}`);
        setCurrentData(response.data);
        const forecastResponse = await axios.get(`http://localhost:8020/api/forecast?latitude=${lat}&longitude=${lon}&days=7`);
        setForecast(forecastResponse.data.forecast.map((item, index) => ({ day: `Day ${index + 1}`, aqi: item.aqi })));
      } catch (err) {
        setError('Failed to fetch data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600';
    if (aqi <= 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {currentData && currentData.aqi > 100 && (
        <div className="bg-red-500 text-white px-4 py-3 text-center font-semibold shadow-lg">
          ⚠️ Air Quality Alert: High AQI detected! Avoid outdoor activities.
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Real-time air quality monitoring and forecasting</p>
        </div>

        {/* Real-Time Monitor */}
        <div className="mb-8">
          <RealTimeMonitor latitude={40.7128} longitude={-74.006} onDataUpdate={handleRealtimeDataUpdate} />
        </div>
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {currentData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">🌬️</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Air Quality Index</h2>
                  <p className="text-sm text-gray-500">Current AQI</p>
                </div>
              </div>
              <p className={`text-3xl font-bold ${getAqiColor(currentData.aqi)}`}>{currentData.aqi}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">🌡️</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">CO₂ Level</h2>
                  <p className="text-sm text-gray-500">Parts per million</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-600">{currentData.co2} ppm</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">💨</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Wind Speed</h2>
                  <p className="text-sm text-gray-500">Meters per second</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-600">{currentData.wind_speed || 'N/A'} m/s</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">🌡️</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Temperature</h2>
                  <p className="text-sm text-gray-500">Celsius</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-red-600">{currentData.temperature}°C</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">💧</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Humidity</h2>
                  <p className="text-sm text-gray-500">Percentage</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-indigo-600">{currentData.humidity}%</p>
            </div>
          </div>
        )}
        {currentData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AQIGaugeChart aqi={currentData.aqi} loading={loading} />
            <AirQualityRadarChart
              aqi={currentData.aqi}
              pm25={currentData.pm25}
              pm10={currentData.pm10}
              co2={currentData.co2}
              temperature={currentData.temperature}
              humidity={currentData.humidity}
              loading={loading}
            />
          </div>
        )}
        {forecast.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📈 7-Day AQI Forecast</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="aqi"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
