import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const PollutantComparisonChart = ({ aqi, pm25, pm10, co2, no2, so2, o3, loading }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-blue-200 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-blue-100 rounded"></div>
        </div>
      </div>
    );
  }

  // WHO guideline values for comparison
  const guidelines = {
    pm25: { who: 25, epa: 35 },
    pm10: { who: 50, epa: 150 },
    co2: { who: 1000, epa: 1000 }, // CO2 is different, using general indoor limit
    no2: { who: 40, epa: 100 },
    so2: { who: 20, epa: 75 },
    o3: { who: 100, epa: 70 }
  };

  const data = [
    {
      pollutant: 'PM2.5',
      current: pm25 || 0,
      who: guidelines.pm25.who,
      epa: guidelines.pm25.epa,
      color: '#ef4444',
      unit: 'μg/m³'
    },
    {
      pollutant: 'PM10',
      current: pm10 || 0,
      who: guidelines.pm10.who,
      epa: guidelines.pm10.epa,
      color: '#f97316',
      unit: 'μg/m³'
    },
    {
      pollutant: 'CO₂',
      current: co2 || 0,
      who: guidelines.co2.who,
      epa: guidelines.co2.epa,
      color: '#eab308',
      unit: 'ppm'
    },
    {
      pollutant: 'NO₂',
      current: no2 || 0,
      who: guidelines.no2.who,
      epa: guidelines.no2.epa,
      color: '#22c55e',
      unit: 'μg/m³'
    },
    {
      pollutant: 'SO₂',
      current: so2 || 0,
      who: guidelines.so2.who,
      epa: guidelines.so2.epa,
      color: '#3b82f6',
      unit: 'μg/m³'
    },
    {
      pollutant: 'O₃',
      current: o3 || 0,
      who: guidelines.o3.who,
      epa: guidelines.o3.epa,
      color: '#8b5cf6',
      unit: 'μg/m³'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Current:</span> {data.current} {data.unit}
            </p>
            <p className="text-sm">
              <span className="font-medium">WHO Limit:</span> {data.who} {data.unit}
            </p>
            <p className="text-sm">
              <span className="font-medium">EPA Limit:</span> {data.epa} {data.unit}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (current, limit) => {
    if (current <= limit * 0.5) return '#22c55e'; // Good
    if (current <= limit) return '#eab308'; // Moderate
    return '#ef4444'; // Poor
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">📊 Pollutant Comparison</h3>
          <p className="text-sm text-gray-600">Current levels vs. health guidelines</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Good</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Poor</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="pollutant"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="current"
            radius={[4, 4, 0, 0]}
            onMouseEnter={(data, index) => setHoveredBar(index)}
            onMouseLeave={() => setHoveredBar(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.current, entry.who)}
                opacity={hoveredBar === index ? 0.8 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Bars show current pollutant levels. Green: Good, Yellow: Moderate, Red: Poor
        </p>
      </div>
    </div>
  );
};

export default PollutantComparisonChart;