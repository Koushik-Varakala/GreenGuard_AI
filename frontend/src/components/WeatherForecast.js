import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';

const WeatherForecast = ({ forecast, destination, travelDate, hasAsthma }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!forecast || forecast.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8">
        <p className="text-neon-cyan/60 text-center py-12">No forecast data available</p>
      </div>
    );
  }

  // Find travel date index
  const travelDateIndex = forecast.findIndex(item => item.date === travelDate);
  const isTravelDayDangerous = travelDateIndex >= 0 && forecast[travelDateIndex]?.aqi > 150;

  const chartData = forecast.map((item, index) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: item.date,
    AQI: Math.round(item.aqi),
    isTravelDay: item.date === travelDate,
    isDangerous: item.aqi > 150,
  }));

  const getBarColor = (aqi, isTravelDay) => {
    if (isTravelDay) {
      if (aqi > 200) return '#ef4444';
      if (aqi > 150) return '#f97316';
      if (aqi > 100) return '#f59e0b';
      return '#00ff88';
    }
    if (aqi <= 50) return '#00ff88';
    if (aqi <= 100) return '#f59e0b';
    if (aqi <= 150) return '#f97316';
    if (aqi <= 200) return '#ef4444';
    return '#8b5cf6';
  };

  const getBarGlow = (aqi, isHovered, isTravelDay) => {
    const color = getBarColor(aqi, isTravelDay);
    if (isTravelDay) {
      return `0 0 40px ${color}, 0 0 80px ${color}`;
    }
    return isHovered
      ? `0 0 30px ${color}, 0 0 60px ${color}`
      : `0 0 10px ${color}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel border-2 border-neon-green/50 rounded-xl p-4 shadow-neon-green">
          <p className="text-neon-green font-display font-bold mb-2">{data.date}</p>
          {data.isTravelDay && (
            <div className="mb-2 px-2 py-1 bg-neon-green/20 rounded text-xs text-neon-green font-semibold">
              Your Travel Day
            </div>
          )}
          <p className="text-neon-cyan text-lg">
            AQI: <span className="font-bold">{data.AQI}</span>
          </p>
          {data.isDangerous && (
            <p className="text-red-300 text-xs mt-1">⚠️ High pollution risk</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-3xl p-8 hover:shadow-neon-green transition-all duration-500 relative overflow-hidden">
      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-cyan/5 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 flex items-center justify-center border-2 border-neon-green/50">
              <svg className="w-8 h-8 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-neon-green mb-1">7-Day Forecast</h2>
              <p className="text-sm text-neon-cyan/70 font-light">{destination} • Air Quality & Weather</p>
            </div>
          </div>
          {isTravelDayDangerous && (
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-400/20 to-red-500/20 border-2 border-red-400/50">
              <p className="text-red-300 text-xs font-semibold uppercase tracking-wider">⚠️ High Risk Day</p>
            </div>
          )}
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
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
            <Bar
              dataKey="AQI"
              radius={[12, 12, 0, 0]}
              onMouseEnter={(data, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => {
                const isHovered = hoveredIndex === index;
                const color = getBarColor(entry.AQI, entry.isTravelDay);
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={color}
                    opacity={isHovered ? 1 : entry.isTravelDay ? 1 : 0.8}
                    style={{
                      filter: `drop-shadow(${getBarGlow(entry.AQI, isHovered, entry.isTravelDay)})`,
                      transform: isHovered || entry.isTravelDay ? 'scaleY(1.1)' : 'scaleY(1)',
                      transformOrigin: 'bottom',
                      transition: 'all 0.3s ease',
                      border: entry.isTravelDay ? '2px solid #00ff88' : 'none',
                    }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Travel Day Highlight */}
        {travelDateIndex >= 0 && (
          <div className={`mt-6 p-4 rounded-xl border-2 ${
            isTravelDayDangerous 
              ? 'border-red-400/50 bg-gradient-to-r from-red-400/10 to-red-500/10' 
              : 'border-neon-green/50 bg-gradient-to-r from-neon-green/10 to-neon-teal/10'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className={`font-semibold mb-1 ${isTravelDayDangerous ? 'text-red-300' : 'text-neon-green'}`}>
                  Your Travel Day: {new Date(travelDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className={`text-sm ${isTravelDayDangerous ? 'text-red-200/80' : 'text-neon-cyan/80'}`}>
                  Expected AQI: {forecast[travelDateIndex]?.aqi?.toFixed(0) || '--'}
                  {isTravelDayDangerous && ' • Consider postponing or taking extra precautions'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
          {[
            { label: 'Good', color: '#00ff88', range: '0-50' },
            { label: 'Moderate', color: '#f59e0b', range: '51-100' },
            { label: 'Unhealthy', color: '#ef4444', range: '151+' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: item.color,
                  boxShadow: `0 0 10px ${item.color}`,
                }}
              ></div>
              <span className="text-sm text-neon-cyan font-medium">{item.label}</span>
              <span className="text-xs text-neon-cyan/50">({item.range})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;



