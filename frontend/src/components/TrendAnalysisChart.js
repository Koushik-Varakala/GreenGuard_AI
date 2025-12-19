import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const TrendAnalysisChart = ({ historicalData, forecastData, loading }) => {
  const [selectedMetric, setSelectedMetric] = useState('aqi');

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-green-200 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-green-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No trend data available</p>
        </div>
      </div>
    );
  }

  // Prepare data for the chart
  const prepareChartData = () => {
    const historical = historicalData.slice(-14).map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: item.date,
      aqi: Math.round(item.aqi),
      pm25: Math.round(item.pm25 || 0),
      pm10: Math.round(item.pm10 || 0),
      temperature: Math.round(item.temperature || 0),
      humidity: Math.round(item.humidity || 0),
      type: 'historical'
    }));

    const forecast = forecastData ? forecastData.slice(0, 7).map((item, index) => ({
      date: `+${index + 1}d`,
      fullDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
      aqi: Math.round(item.aqi),
      pm25: Math.round(item.pm25 || 0),
      pm10: Math.round(item.pm10 || 0),
      temperature: Math.round(item.temperature || 0),
      humidity: Math.round(item.humidity || 0),
      type: 'forecast'
    })) : [];

    return [...historical, ...forecast];
  };

  const chartData = prepareChartData();

  const metrics = [
    { key: 'aqi', label: 'AQI', color: '#8b5cf6' },
    { key: 'pm25', label: 'PM2.5', color: '#ef4444' },
    { key: 'pm10', label: 'PM10', color: '#f97316' },
    { key: 'temperature', label: 'Temperature', color: '#06b6d4' },
    { key: 'humidity', label: 'Humidity', color: '#3b82f6' }
  ];

  const selectedMetricData = metrics.find(m => m.key === selectedMetric);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {metrics.map(metric => (
              <p key={metric.key} className="text-sm">
                <span className="font-medium" style={{ color: metric.color }}>
                  {metric.label}:
                </span> {data[metric.key]}
                {metric.key === 'temperature' ? '°C' :
                 metric.key === 'humidity' ? '%' : ''}
              </p>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Type: {data.type}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">📈 Trend Analysis</h3>
          <p className="text-sm text-gray-600">Historical data and future predictions</p>
        </div>
        <div className="flex space-x-2">
          {metrics.map(metric => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedMetric === metric.key
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={selectedMetricData.color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={selectedMetricData.color} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={selectedMetricData.color} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={selectedMetricData.color} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={selectedMetric}
            stroke={selectedMetricData.color}
            fillOpacity={1}
            fill="url(#historicalGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-200 rounded"></div>
          <span className="text-gray-600">Historical Data</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-100 rounded border border-purple-300"></div>
          <span className="text-gray-600">Forecast Data</span>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysisChart;