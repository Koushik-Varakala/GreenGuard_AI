import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PollutionPieChart = ({ aqi, pm25, pm10, loading }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-neon-green/20 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-neon-green/10 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Calculate pollution source distribution (simulated based on AQI)
  const getPollutionData = () => {
    const baseValue = aqi || 100;
    return [
      { name: 'Vehicles', value: Math.round(baseValue * 0.35), color: '#00ff88' },
      { name: 'Industries', value: Math.round(baseValue * 0.30), color: '#00d9ff' },
      { name: 'Construction', value: Math.round(baseValue * 0.20), color: '#00ffd9' },
      { name: 'Natural', value: Math.round(baseValue * 0.15), color: '#8b5cf6' },
    ];
  };

  const data = getPollutionData();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="glass-panel border border-neon-green/50 rounded-xl p-4 shadow-neon-green">
          <p className="text-neon-green font-semibold mb-1">{data.name}</p>
          <p className="text-neon-cyan text-sm">
            {data.value} μg/m³ ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#00ff88"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
        style={{ textShadow: '0 0 10px rgba(0, 255, 136, 0.8)' }}
      >
        {name}
      </text>
    );
  };

  return (
    <div className="glass-panel rounded-3xl p-8 hover:shadow-neon-green transition-all duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 flex items-center justify-center border border-neon-green/30">
          <svg className="w-6 h-6 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-neon-green">Pollution Sources</h2>
          <p className="text-sm text-neon-cyan/70">Distribution Analysis</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeIndex === index ? 1 : activeIndex === null ? 1 : 0.5}
                  style={{
                    filter: `drop-shadow(0 0 10px ${entry.color})`,
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-neon-green mb-1">
              {total}
            </div>
            <div className="text-xs text-neon-cyan/70 uppercase tracking-wider">
              Total AQI
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-neon-green/10 transition-all cursor-pointer"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: item.color,
                boxShadow: `0 0 10px ${item.color}`,
              }}
            ></div>
            <div className="flex-1">
              <p className="text-xs text-neon-green font-semibold">{item.name}</p>
              <p className="text-xs text-neon-cyan/70">
                {((item.value / total) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollutionPieChart;



