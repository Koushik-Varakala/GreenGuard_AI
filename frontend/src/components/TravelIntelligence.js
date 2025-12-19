import React from 'react';

const TravelIntelligence = ({ travelData, isHighAltitude, userType, hasAsthma }) => {
  if (!travelData) return null;

  const getRiskColor = (level) => {
    if (level.toLowerCase().includes('low')) return 'from-neon-green/20 to-neon-teal/20 border-neon-green/50 text-neon-green';
    if (level.toLowerCase().includes('moderate')) return 'from-yellow-400/20 to-orange-400/20 border-yellow-400/50 text-yellow-300';
    if (level.toLowerCase().includes('high')) return 'from-orange-400/20 to-red-400/20 border-orange-400/50 text-orange-300';
    return 'from-red-400/20 to-red-500/20 border-red-400/50 text-red-300';
  };

  const riskConfig = getRiskColor(travelData.exposure_level || 'low');

  return (
    <div className="glass-panel rounded-3xl p-8 hover:shadow-neon-green transition-all duration-500 relative overflow-hidden">
      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-cyan/5 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/30 to-neon-cyan/30 flex items-center justify-center border-2 border-neon-green/50 glow-green">
            <svg className="w-8 h-8 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-neon-green mb-1">Travel Intelligence</h2>
            <p className="text-sm text-neon-cyan/70 font-light">
              {travelData.from} → {travelData.to}
            </p>
          </div>
        </div>

        {/* Route Analysis */}
        <div className={`bg-gradient-to-r ${riskConfig} border-2 rounded-2xl p-6 mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-neon-cyan/60 mb-1 uppercase tracking-wider">Exposure Level</p>
              <p className={`text-2xl font-display font-bold ${riskConfig.split(' ')[2]}`}>
                {travelData.exposure_level}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neon-cyan/60 mb-1 uppercase tracking-wider">Route Average</p>
              <p className="text-3xl font-display font-bold text-neon-green">
                {travelData.route_average_aqi?.toFixed(0) || '--'}
              </p>
              <p className="text-xs text-neon-cyan/60">AQI</p>
            </div>
          </div>
          <p className={`text-sm ${riskConfig.split(' ')[2]} opacity-90`}>
            {travelData.risk_assessment}
          </p>
        </div>

        {/* Location Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-cosmic rounded-xl p-4 border border-neon-green/20">
            <p className="text-xs text-neon-cyan/60 mb-2 uppercase tracking-wider">From</p>
            <p className="text-lg font-display font-bold text-neon-green mb-1">{travelData.from}</p>
            <p className="text-2xl font-display font-bold text-neon-cyan">
              {travelData.source_aqi?.toFixed(0) || '--'}
            </p>
            <p className="text-xs text-neon-cyan/60">AQI</p>
          </div>
          <div className="glass-cosmic rounded-xl p-4 border border-neon-green/20">
            <p className="text-xs text-neon-cyan/60 mb-2 uppercase tracking-wider">To</p>
            <p className="text-lg font-display font-bold text-neon-green mb-1">{travelData.to}</p>
            <p className="text-2xl font-display font-bold text-neon-cyan">
              {travelData.dest_aqi?.toFixed(0) || '--'}
            </p>
            <p className="text-xs text-neon-cyan/60">AQI</p>
          </div>
        </div>

        {/* High Altitude Warning */}
        {isHighAltitude && (
          <div className="glass-cosmic border-2 border-yellow-400/50 rounded-xl p-4 mb-6 bg-gradient-to-r from-yellow-400/10 to-orange-400/10">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏔️</span>
              <div>
                <p className="text-yellow-300 font-semibold mb-1">High Altitude Destination</p>
                <p className="text-yellow-200/80 text-sm">
                  {travelData.to} is a high-altitude region. Special precautions are recommended for altitude adaptation and oxygen levels.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <h3 className="text-sm font-display font-semibold text-neon-green uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Route Recommendations
          </h3>
          <div className="space-y-2">
            {travelData.recommendations?.map((rec, index) => (
              <div key={index} className="glass-cosmic rounded-lg p-3 text-sm text-neon-cyan/90 border border-neon-green/20">
                {rec}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelIntelligence;



