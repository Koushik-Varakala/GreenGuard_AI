import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ForecastChart = ({ forecastData, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-neon-green/20 rounded w-1/3 mb-6 skeleton-cosmic"></div>
          <div className="h-80 bg-neon-green/10 rounded-2xl skeleton-cosmic"></div>
        </div>
      </div>
    );
  }

  if (!forecastData || forecastData.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 flex items-center justify-center border border-neon-green/30">
            <svg className="w-6 h-6 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-neon-green">7-Day Forecast</h2>
            <p className="text-sm text-neon-cyan/70">AI-powered predictions</p>
          </div>
        </div>
        <p className="text-neon-cyan/60 text-center py-12">No forecast data available</p>
      </div>
    );
  }

  const chartData = forecastData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    AQI: Math.round(item.aqi),
    PM25: Math.round(item.pm25 || 0),
    PM10: Math.round(item.pm10 || 0),
    Temperature: Math.round(item.temperature || 0),
    Humidity: Math.round(item.humidity || 0),
    WindSpeed: Math.round(item.wind_speed || 0),
    fullDate: item.date,
    dayName: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
  }));

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#00ff88';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff8800';
    if (aqi <= 200) return '#ff4444';
    if (aqi <= 300) return '#aa00aa';
    return '#660000';
  };

  const getWeatherIcon = (temp, wind) => {
    if (temp > 25) return '☀️';
    if (temp < 15) return '❄️';
    if (wind > 8) return '💨';
    return '⛅';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel border border-neon-green/50 rounded-xl p-4 shadow-neon-green">
          <p className="text-neon-green font-semibold mb-2">{label} ({data.dayName})</p>
          <div className="space-y-1 text-sm">
            <p className="text-neon-cyan">AQI: <span className="font-bold">{data.AQI}</span></p>
            <p className="text-neon-cyan">PM2.5: <span className="font-bold">{data.PM25} μg/m³</span></p>
            <p className="text-neon-cyan">PM10: <span className="font-bold">{data.PM10} μg/m³</span></p>
            <p className="text-neon-cyan">Temp: <span className="font-bold">{data.Temperature}°C</span> {getWeatherIcon(data.Temperature, data.WindSpeed)}</p>
            <p className="text-neon-cyan">Humidity: <span className="font-bold">{data.Humidity}%</span></p>
            <p className="text-neon-cyan">Wind: <span className="font-bold">{data.WindSpeed} m/s</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  const avgAQI = Math.round(chartData.reduce((sum, item) => sum + item.AQI, 0) / chartData.length);
  const avgColor = getAQIColor(avgAQI);

  return (
    <div className="glass-panel rounded-3xl p-8 hover:shadow-neon-green transition-all duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 flex items-center justify-center border-2 border-neon-green/50">
            <svg className="w-8 h-8 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-neon-green mb-1">7-Day Weather-Aware Forecast</h2>
            <p className="text-sm text-neon-cyan/70 font-light">Dynamic AQI predictions based on weather patterns</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-neon-cyan/60 mb-1">Average</p>
          <p className="text-3xl font-display font-bold text-neon-green" style={{ textShadow: `0 0 20px ${avgColor}` }}>
            {avgAQI}
          </p>
        </div>
      </div>

      {/* Weather Summary */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {chartData.map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-xs text-neon-cyan/70 mb-1">{item.dayName}</p>
            <p className="text-lg mb-1">{getWeatherIcon(item.Temperature, item.WindSpeed)}</p>
            <p className="text-xs text-neon-cyan">{item.Temperature}°C</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAqiForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={avgColor} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={avgColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#00d9ff" strokeOpacity={0.1} />
          <XAxis 
            dataKey="date" 
            stroke="#00d9ff"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tick={{ fill: '#00d9ff' }}
          />
          <YAxis 
            stroke="#00d9ff"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tick={{ fill: '#00d9ff' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="AQI"
            stroke={avgColor}
            strokeWidth={4}
            fill="url(#colorAqiForecast)"
            dot={{ fill: avgColor, r: 6, strokeWidth: 2, stroke: '#0a0a0f' }}
            activeDot={{ r: 10, stroke: avgColor, strokeWidth: 3, fill: '#0a0a0f' }}
            style={{
              filter: `drop-shadow(0 0 10px ${avgColor})`,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* AQI Scale */}
      <div className="mt-6 flex justify-between items-center text-xs text-neon-cyan/70">
        <span>Good (0-50)</span>
        <span>Moderate (51-100)</span>
        <span>Unhealthy (101-150)</span>
        <span>Very Unhealthy (151+)</span>
      </div>

      {/* AI Insight Annotation */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-neon-green/10 to-neon-cyan/10 border border-neon-green/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <p className="text-sm text-neon-green font-semibold mb-1">AI Insight</p>
            <p className="text-xs text-neon-cyan/70">
              {avgAQI <= 100 
                ? 'Air quality is expected to remain within acceptable limits.'
                : avgAQI <= 150
                ? 'Moderate pollution levels detected. Sensitive groups should take precautions.'
                : 'High pollution forecast. Consider limiting outdoor activities.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;
