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
} from 'recharts';

const HistoricalChart = ({ historicalData, loading }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

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

  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 flex items-center justify-center border border-neon-green/30">
            <svg className="w-6 h-6 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-neon-green">6-Month Historical Trends</h2>
            <p className="text-sm text-neon-cyan/70">Energy Pillar Visualization</p>
          </div>
        </div>
        <p className="text-neon-cyan/60 text-center py-12">No historical data available</p>
      </div>
    );
  }

  // Get last 7 days for histogram
  const last7Days = historicalData.slice(-7).map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    AQI: Math.round(item.aqi),
    PM25: Math.round(item.pm25 || 0),
    CO2: Math.round(item.co2 || 0),
    fullDate: item.date,
  }));

  const getBarColor = (aqi) => {
    if (aqi <= 50) return '#00ff88';
    if (aqi <= 100) return '#f59e0b';
    if (aqi <= 150) return '#f97316';
    if (aqi <= 200) return '#ef4444';
    return '#8b5cf6';
  };

  const getBarGlow = (aqi, isHovered) => {
    const color = getBarColor(aqi);
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
        <div className="space-y-1">
          <p className="text-neon-cyan text-sm">
            AQI: <span className="font-semibold">{data.AQI}</span>
          </p>
          <p className="text-neon-cyan/70 text-xs">
            PM2.5: {data.PM25} μg/m³
          </p>
          <p className="text-neon-teal/70 text-xs">
            CO₂: {data.CO2} ppm
          </p>
        </div>
      </div>
      );
    }
    return null;
  };

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
            <h2 className="text-2xl font-display font-bold text-neon-green mb-1">7-Day Energy Pillars</h2>
            <p className="text-sm text-neon-cyan/70 font-light">Historical AQI Visualization</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-neon-cyan/60 mb-1">Period</p>
          <p className="text-lg font-display font-bold text-neon-green">7 Days</p>
        </div>
      </div>

      {/* Bar Chart - Floating Energy Pillars */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={last7Days}
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
            animationBegin={0}
          >
            {last7Days.map((entry, index) => {
              const isHovered = hoveredIndex === index;
              const color = getBarColor(entry.AQI);
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={color}
                  opacity={isHovered ? 1 : 0.8}
                  style={{
                    filter: `drop-shadow(${getBarGlow(entry.AQI, isHovered)})`,
                    transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)',
                    transformOrigin: 'bottom',
                    transition: 'all 0.3s ease',
                  }}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

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
  );
};

export default HistoricalChart;
