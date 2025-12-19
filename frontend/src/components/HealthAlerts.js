import React from 'react';

const HealthAlerts = ({ aqi, status, hasAsthma, userType, destination, isHighAltitude }) => {
  if (!aqi) return null;

  const alerts = [];
  const recommendations = [];

  // AQI-based alerts
  if (aqi > 150) {
    alerts.push({
      type: 'critical',
      icon: '🚨',
      title: 'High Air Pollution Alert',
      message: `Current AQI is ${Math.round(aqi)} - ${status}. Air quality is unhealthy.`,
      color: 'from-red-400/20 to-red-500/20 border-red-400/50 text-red-300',
    });
  } else if (aqi > 100) {
    alerts.push({
      type: 'warning',
      icon: '⚠️',
      title: 'Moderate Air Quality',
      message: `AQI is ${Math.round(aqi)}. Sensitive individuals should take precautions.`,
      color: 'from-yellow-400/20 to-orange-400/20 border-yellow-400/50 text-yellow-300',
    });
  }

  // Asthma-specific alerts
  if (hasAsthma) {
    if (aqi > 100) {
      alerts.push({
        type: 'critical',
        icon: '🫁',
        title: 'Asthma Alert',
        message: 'High pollution levels detected. Your respiratory condition may be affected.',
        color: 'from-red-400/20 to-red-500/20 border-red-400/50 text-red-300',
      });
      recommendations.push('Carry your rescue inhaler at all times');
      recommendations.push('Avoid outdoor activities during peak pollution hours');
      recommendations.push('Wear an N95 mask when going outside');
    } else if (aqi > 50) {
      recommendations.push('Monitor your breathing and have inhaler ready');
      recommendations.push('Consider wearing a mask if you experience any discomfort');
    }

    if (isHighAltitude) {
      alerts.push({
        type: 'warning',
        icon: '🏔️',
        title: 'High Altitude + Asthma',
        message: `${destination} is a high-altitude destination. Lower oxygen levels may affect your breathing.`,
        color: 'from-orange-400/20 to-red-400/20 border-orange-400/50 text-orange-300',
      });
      recommendations.push('Consult your doctor before traveling to high altitude');
      recommendations.push('Carry extra inhalers and medications');
      recommendations.push('Consider portable oxygen support');
      recommendations.push('Avoid strenuous activities for first 2-3 days');
    }
  }

  // High altitude alerts (general)
  if (isHighAltitude && !hasAsthma) {
    alerts.push({
      type: 'info',
      icon: '🏔️',
      title: 'High Altitude Destination',
      message: `${destination} is at high altitude. Be prepared for lower oxygen levels.`,
      color: 'from-neon-cyan/20 to-neon-blue/20 border-neon-cyan/50 text-neon-cyan',
    });
  }

  // User type specific
  if (userType === 'child' && aqi > 100) {
    recommendations.push('Keep children indoors as much as possible');
    recommendations.push('Cancel outdoor play and sports activities');
    recommendations.push('Ensure indoor air is filtered with HEPA purifiers');
  }

  if (userType === 'elderly' && aqi > 100) {
    recommendations.push('Elderly individuals should avoid all outdoor activities');
    recommendations.push('Stay in well-ventilated, filtered indoor spaces');
    recommendations.push('Monitor for chest pain or breathing difficulties');
  }

  if (alerts.length === 0 && recommendations.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-teal/20 flex items-center justify-center border-2 border-neon-green/50">
            <span className="text-3xl">✓</span>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-neon-green mb-1">Health Status</h2>
            <p className="text-neon-cyan/70 text-sm">Air quality is safe for your travel</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-8 hover:shadow-neon-green transition-all duration-500 relative overflow-hidden">
      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-cyan/5 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 flex items-center justify-center border-2 border-neon-green/50">
            <svg className="w-8 h-8 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-neon-green mb-1">Health Alerts</h2>
            <p className="text-sm text-neon-cyan/70 font-light">Personalized health guidance</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-4 mb-6">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${alert.color} border-2 rounded-xl p-4 animate-pulse`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{alert.icon}</span>
                <div className="flex-1">
                  <p className="font-display font-bold text-lg mb-1">{alert.title}</p>
                  <p className="text-sm opacity-90">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h3 className="text-sm font-display font-semibold text-neon-green uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Health Recommendations
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="glass-cosmic rounded-lg p-3 text-sm text-neon-cyan/90 border border-neon-green/20 flex items-start gap-3">
                  <span className="text-neon-green font-bold flex-shrink-0">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthAlerts;



