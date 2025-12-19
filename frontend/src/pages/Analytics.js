import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AirQualityRadarChart from '../components/AirQualityRadarChart';
import PollutantComparisonChart from '../components/PollutantComparisonChart';
import TrendAnalysisChart from '../components/TrendAnalysisChart';
import AQIGaugeChart from '../components/AQIGaugeChart';
import PollutionPieChart from '../components/PollutionPieChart';
import ForecastChart from '../components/ForecastChart';
import HistoricalChart from '../components/HistoricalChart';
import RealTimeMonitor from '../components/RealTimeMonitor';

const Analytics = () => {
  const [currentData, setCurrentData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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
        aqi: Math.round((data.pm25 * 5 + data.pm10 * 2 + data.co2 * 0.1) / 3)
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock current location - in real app, get from geolocation
        const lat = 40.7128;
        const lon = -74.0060;

        // Fetch current AQI data
        const currentResponse = await axios.get(`http://localhost:8020/api/current-aqi?latitude=${lat}&longitude=${lon}`);
        setCurrentData(currentResponse.data);

        // Fetch forecast data
        const forecastResponse = await axios.get(`http://localhost:8020/api/forecast?latitude=${lat}&longitude=${lon}&days=7`);
        setForecastData(forecastResponse.data.forecast);

        // Fetch historical data (mock data for now)
        const mockHistoricalData = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
          aqi: Math.floor(Math.random() * 150) + 20,
          pm25: Math.floor(Math.random() * 50) + 5,
          pm10: Math.floor(Math.random() * 100) + 10,
          temperature: Math.floor(Math.random() * 20) + 15,
          humidity: Math.floor(Math.random() * 40) + 40
        }));
        setHistoricalData(mockHistoricalData);

      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error('Analytics data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'realtime', label: 'Real-Time', icon: '⚡' },
    { id: 'pollutants', label: 'Pollutants', icon: '🧪' },
    { id: 'trends', label: 'Trends', icon: '📈' },
    { id: 'forecast', label: 'Forecast', icon: '🔮' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AQIGaugeChart aqi={currentData?.aqi} loading={loading} />
              <AirQualityRadarChart
                aqi={currentData?.aqi}
                pm25={currentData?.pm25}
                pm10={currentData?.pm10}
                co2={currentData?.co2}
                temperature={currentData?.temperature}
                humidity={currentData?.humidity}
                loading={loading}
              />
            </div>
            <PollutionPieChart
              aqi={currentData?.aqi}
              pm25={currentData?.pm25}
              pm10={currentData?.pm10}
              loading={loading}
            />
          </div>
        );

      case 'realtime':
        return (
          <div className="space-y-6">
            <RealTimeMonitor latitude={40.7128} longitude={-74.006} onDataUpdate={handleRealtimeDataUpdate} />
          </div>
        );

      case 'pollutants':
        return (
          <div className="space-y-6">
            <PollutantComparisonChart
              aqi={currentData?.aqi}
              pm25={currentData?.pm25}
              pm10={currentData?.pm10}
              co2={currentData?.co2}
              no2={currentData?.no2}
              so2={currentData?.so2}
              o3={currentData?.o3}
              loading={loading}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PollutionPieChart
                aqi={currentData?.aqi}
                pm25={currentData?.pm25}
                pm10={currentData?.pm10}
                loading={loading}
              />
              <AirQualityRadarChart
                aqi={currentData?.aqi}
                pm25={currentData?.pm25}
                pm10={currentData?.pm10}
                co2={currentData?.co2}
                temperature={currentData?.temperature}
                humidity={currentData?.humidity}
                loading={loading}
              />
            </div>
          </div>
        );

      case 'trends':
        return (
          <div className="space-y-6">
            <TrendAnalysisChart
              historicalData={historicalData}
              forecastData={forecastData}
              loading={loading}
            />
            <HistoricalChart
              historicalData={historicalData}
              loading={loading}
            />
          </div>
        );

      case 'forecast':
        return (
          <div className="space-y-6">
            <ForecastChart
              forecastData={forecastData}
              loading={loading}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AQIGaugeChart aqi={currentData?.aqi} loading={loading} />
              <AirQualityRadarChart
                aqi={currentData?.aqi}
                pm25={currentData?.pm25}
                pm10={currentData?.pm10}
                co2={currentData?.co2}
                temperature={currentData?.temperature}
                humidity={currentData?.humidity}
                loading={loading}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive air quality data visualization and insights</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {renderTabContent()}
        </div>

        {/* Summary Stats */}
        {currentData && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">📈 Key Metrics Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{currentData.aqi}</div>
                <div className="text-sm text-gray-600">AQI</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{currentData.pm25}</div>
                <div className="text-sm text-gray-600">PM2.5</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{currentData.pm10}</div>
                <div className="text-sm text-gray-600">PM10</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{currentData.co2}</div>
                <div className="text-sm text-gray-600">CO₂</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">{currentData.temperature}°C</div>
                <div className="text-sm text-gray-600">Temp</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{currentData.humidity}%</div>
                <div className="text-sm text-gray-600">Humidity</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;