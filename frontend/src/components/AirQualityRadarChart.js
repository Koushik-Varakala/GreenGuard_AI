import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const AirQualityRadarChart = ({ aqi, pm25, pm10, co2, temperature, humidity, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-purple-200 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-purple-100 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Normalize data for radar chart (scale to 0-100)
  const normalizeValue = (value, max) => Math.min((value / max) * 100, 100);

  const data = [
    {
      metric: 'AQI',
      value: normalizeValue(aqi || 0, 500),
      actual: aqi || 0,
      color: '#8b5cf6'
    },
    {
      metric: 'PM2.5',
      value: normalizeValue(pm25 || 0, 100),
      actual: pm25 || 0,
      color: '#ef4444'
    },
    {
      metric: 'PM10',
      value: normalizeValue(pm10 || 0, 200),
      actual: pm10 || 0,
      color: '#f97316'
    },
    {
      metric: 'CO₂',
      value: normalizeValue(co2 || 0, 2000),
      actual: co2 || 0,
      color: '#eab308'
    },
    {
      metric: 'Temp',
      value: normalizeValue(temperature || 0, 50),
      actual: temperature || 0,
      color: '#06b6d4'
    },
    {
      metric: 'Humidity',
      value: normalizeValue(humidity || 0, 100),
      actual: humidity || 0,
      color: '#3b82f6'
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-800">{data.metric}</p>
          <p className="text-sm text-gray-600">
            Value: {data.actual}
            {data.metric === 'Temp' ? '°C' :
             data.metric === 'Humidity' ? '%' :
             data.metric === 'CO₂' ? ' ppm' : ''}
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
          <h3 className="text-xl font-bold text-gray-800">📊 Air Quality Metrics</h3>
          <p className="text-sm text-gray-600">Multi-dimensional analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Current Levels</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Air Quality Metrics"
            dataKey="value"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-sm font-medium text-gray-700">{item.metric}</div>
            <div className="text-lg font-bold" style={{ color: item.color }}>
              {item.actual}
              {item.metric === 'Temp' ? '°C' :
               item.metric === 'Humidity' ? '%' :
               item.metric === 'CO₂' ? ' ppm' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQualityRadarChart;