import React from 'react';

const AQICard = ({ aqi, status, pm25, pm10, co2, temperature, humidity, windSpeed, loading }) => {
  const getAQIConfig = (aqi) => {
    if (aqi <= 50) return {
      glow: 'glow-green',
      text: 'text-neon-green',
      border: 'border-neon-green/50',
      bg: 'from-neon-green/20 to-neon-green/10',
    };
    if (aqi <= 100) return {
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
      text: 'text-yellow-400',
      border: 'border-yellow-400/50',
      bg: 'from-yellow-400/20 to-yellow-400/10',
    };
    if (aqi <= 150) return {
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]',
      text: 'text-orange-400',
      border: 'border-orange-400/50',
      bg: 'from-orange-400/20 to-orange-400/10',
    };
    if (aqi <= 200) return {
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
      text: 'text-red-400',
      border: 'border-red-400/50',
      bg: 'from-red-400/20 to-red-400/10',
    };
    return {
      glow: 'shadow-[0_0_30px_rgba(139,92,246,0.6)]',
      text: 'text-purple-400',
      border: 'border-purple-400/50',
      bg: 'from-purple-400/20 to-purple-400/10',
    };
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-neon-green/20 rounded w-1/3 skeleton-cosmic"></div>
          <div className="h-32 bg-neon-green/10 rounded-2xl skeleton-cosmic"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-neon-green/10 rounded-xl skeleton-cosmic"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const config = getAQIConfig(aqi || 0);

  return (
    <div className="glass-panel rounded-3xl p-8 hover:shadow-neon-green transition-all duration-500 relative overflow-hidden">
      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-cyan/5 pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/30 to-neon-cyan/30 flex items-center justify-center border-2 border-neon-green/50 glow-green">
            <svg className="w-8 h-8 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-neon-green mb-1">Air Quality Index</h2>
            <p className="text-sm text-neon-cyan/70 font-light">Real-time Environmental Core</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl border-2 ${config.border} bg-gradient-to-r ${config.bg} ${config.glow}`}>
          <span className={`text-sm font-semibold ${config.text} uppercase tracking-wider`}>
            {status}
          </span>
        </div>
      </div>

      {/* Central Intelligence Core - Floating Hologram */}
      <div className={`relative z-10 bg-gradient-to-br ${config.bg} rounded-3xl p-10 mb-8 border-2 ${config.border} ${config.glow} transform-3d`}>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-energy-flow"></div>
        <div className="relative z-10">
          {/* Main AQI Display */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-3 mb-4">
              <div className={`text-8xl font-display font-black ${config.text} drop-shadow-[0_0_20px_currentColor]`}>
                {Math.round(aqi || 0)}
              </div>
              <div className={`text-2xl ${config.text} font-light`}>AQI</div>
            </div>
            <div className={`text-xl ${config.text} font-semibold uppercase tracking-wider mb-4`}>
              {status}
            </div>
          </div>
          
          {/* CO₂ Concentration - Central Display */}
          <div className="glass-cosmic rounded-2xl p-6 border-2 border-neon-cyan/30 bg-gradient-to-r from-neon-cyan/10 to-neon-teal/10 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/30 to-neon-teal/30 flex items-center justify-center border border-neon-cyan/50">
                  <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-neon-cyan/60 uppercase tracking-wider font-semibold mb-1">CO₂ Concentration</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-neon-cyan">
                      {co2 ? Math.round(co2) : '--'}
                    </span>
                    <span className="text-sm text-neon-cyan/70 font-light">ppm</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-semibold ${co2 && co2 > 450 ? 'text-red-300' : co2 && co2 > 400 ? 'text-yellow-300' : 'text-neon-green'} uppercase`}>
                  {co2 && co2 > 450 ? 'High' : co2 && co2 > 400 ? 'Elevated' : 'Normal'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid - Floating Pills */}
      <div className="relative z-10 grid grid-cols-3 gap-4">
        {[
          { label: 'PM2.5', value: pm25?.toFixed(1), unit: 'μg/m³', icon: '💨' },
          { label: 'PM10', value: pm10?.toFixed(1), unit: 'μg/m³', icon: '🌫️' },
          { label: 'Temp', value: temperature?.toFixed(1), unit: '°C', icon: '🌡️' },
        ].map((metric, idx) => (
          <div
            key={idx}
            className="glass-cosmic rounded-2xl p-4 border border-neon-cyan/20 hover:border-neon-green/50 hover:shadow-neon-cyan transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-neon-cyan/60 uppercase tracking-wider font-semibold">
                {metric.label}
              </span>
              <span className="text-xl group-hover:scale-110 transition-transform">{metric.icon}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-display font-bold text-neon-green">
                {metric.value || '--'}
              </span>
              <span className="text-xs text-neon-cyan/70 font-light">
                {metric.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Status Indicator */}
      <div className="relative z-10 mt-8 pt-6 border-t border-neon-green/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse glow-green"></div>
            <p className="text-xs text-neon-cyan/60 font-light">AI Core Active</p>
          </div>
          <p className="text-xs text-neon-cyan/60 font-light font-mono">
            Updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AQICard;
