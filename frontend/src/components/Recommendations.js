import React from 'react';

const Recommendations = ({ recommendations, riskLevel, outdoorActivity, maskRequired, airPurifier, userType, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neon-green/20 rounded w-1/3 skeleton-cosmic"></div>
          <div className="h-20 bg-neon-green/10 rounded-xl skeleton-cosmic"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-neon-green/10 rounded w-full skeleton-cosmic"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 flex items-center justify-center border border-neon-green/30">
            <svg className="w-6 h-6 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-neon-green">Health Recommendations</h2>
            <p className="text-sm text-neon-cyan/70">Personalized guidance</p>
          </div>
        </div>
        <p className="text-neon-cyan/60 text-center py-8">Enter location to get recommendations</p>
      </div>
    );
  }

  const getRiskConfig = (risk) => {
    if (risk.toLowerCase().includes('low')) {
      return {
        glow: 'shadow-[0_0_20px_rgba(0,255,136,0.4)]',
        border: 'border-neon-green/50',
        bg: 'from-neon-green/20 to-neon-green/10',
        text: 'text-neon-green',
        icon: '✓'
      };
    }
    if (risk.toLowerCase().includes('moderate')) {
      return {
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
        border: 'border-yellow-400/50',
        bg: 'from-yellow-400/20 to-yellow-400/10',
        text: 'text-yellow-300',
        icon: '⚠'
      };
    }
    if (risk.toLowerCase().includes('high')) {
      return {
        glow: 'shadow-[0_0_30px_rgba(249,115,22,0.5)]',
        border: 'border-orange-400/50',
        bg: 'from-orange-400/20 to-orange-400/10',
        text: 'text-orange-300',
        icon: '⚠️'
      };
    }
    return {
      glow: 'shadow-[0_0_40px_rgba(239,68,68,0.6)]',
      border: 'border-red-400/50',
      bg: 'from-red-400/20 to-red-400/10',
      text: 'text-red-300',
      icon: '🚨'
    };
  };

  const getUserTypeConfig = () => {
    const configs = {
      child: { icon: '👶', label: 'Child', color: 'from-neon-blue/20 to-neon-cyan/20' },
      elderly: { icon: '👴', label: 'Elderly', color: 'from-neon-purple/20 to-neon-blue/20' },
      sensitive: { icon: '🏥', label: 'Respiratory Condition', color: 'from-red-400/20 to-orange-400/20' },
      normal: { icon: '👤', label: 'Adult', color: 'from-neon-green/20 to-neon-teal/20' }
    };
    return configs[userType] || configs.normal;
  };

  const riskConfig = getRiskConfig(riskLevel);
  const userConfig = getUserTypeConfig();

  return (
    <div className="glass-panel rounded-3xl p-8 hover:shadow-neon-green transition-all duration-500 relative overflow-hidden">
      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-cyan/5 pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${userConfig.color} flex items-center justify-center border-2 border-neon-green/50`}>
            <span className="text-3xl">{userConfig.icon}</span>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-neon-green mb-1">Health Recommendations</h2>
            <p className="text-sm text-neon-cyan/70 font-light">{userConfig.label} Profile</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl border-2 ${riskConfig.border} bg-gradient-to-r ${riskConfig.bg} ${riskConfig.glow}`}>
          <span className={`text-sm font-semibold ${riskConfig.text} uppercase tracking-wider`}>
            {riskConfig.icon} {riskLevel}
          </span>
        </div>
      </div>

      {/* Risk Banner */}
      <div className={`relative z-10 bg-gradient-to-r ${riskConfig.bg} border-2 ${riskConfig.border} rounded-2xl p-4 mb-6 ${riskConfig.glow}`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${riskConfig.bg} flex items-center justify-center border ${riskConfig.border}`}>
            <span className="text-2xl">{riskConfig.icon}</span>
          </div>
          <div>
            <p className={`font-display font-bold text-lg mb-1 ${riskConfig.text}`}>Risk Assessment</p>
            <p className={`text-sm ${riskConfig.text} opacity-80`}>{riskLevel}</p>
          </div>
        </div>
      </div>

      {/* Activity Status */}
      <div className="relative z-10 glass-cosmic rounded-2xl p-4 mb-6 border border-neon-cyan/20">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <div className="flex-1">
            <p className="text-xs text-neon-cyan/60 mb-1 uppercase tracking-wider">Outdoor Activity</p>
            <p className="font-display font-semibold text-neon-green text-lg">{outdoorActivity}</p>
          </div>
        </div>
      </div>

      {/* Action Items */}
      {(maskRequired || airPurifier) && (
        <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
          {maskRequired && (
            <div className="glass-cosmic border-2 border-red-400/50 rounded-2xl p-4 flex items-center gap-3 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-400/20 flex items-center justify-center border border-red-400/50">
                <span className="text-2xl">😷</span>
              </div>
              <div>
                <p className="text-xs text-red-300 font-semibold mb-1 uppercase">Required</p>
                <p className="text-sm font-bold text-red-200">N95 Mask</p>
              </div>
            </div>
          )}
          {airPurifier && (
            <div className="glass-cosmic border-2 border-neon-cyan/50 rounded-2xl p-4 flex items-center gap-3 hover:border-neon-cyan hover:shadow-neon-cyan transition-all">
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/50">
                <span className="text-2xl">💨</span>
              </div>
              <div>
                <p className="text-xs text-neon-cyan font-semibold mb-1 uppercase">Recommended</p>
                <p className="text-sm font-bold text-neon-green">Air Purifier</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations List */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-display font-semibold text-neon-green uppercase tracking-wider">Recommendations</h3>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="glass-cosmic rounded-xl p-4 border border-neon-green/20 hover:border-neon-green/50 hover:shadow-neon-green transition-all duration-300 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green/30 to-neon-cyan/30 flex items-center justify-center flex-shrink-0 border border-neon-green/50 group-hover:scale-110 transition-transform">
                  <span className="text-xs font-bold text-neon-green">{index + 1}</span>
                </div>
                <p className="text-sm text-neon-cyan/90 leading-relaxed flex-1">{rec}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
