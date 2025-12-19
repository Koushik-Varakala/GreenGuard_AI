import React from 'react';

const AlertBanner = ({ aqi, status, userType }) => {
  if (!aqi) return null;

  const getAlertConfig = () => {
    if (aqi <= 50) return null; // No alert for good air
    if (aqi <= 100) return {
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.6)]',
      border: 'border-yellow-400/50',
      bg: 'from-yellow-400/20 to-yellow-400/10',
      text: 'text-yellow-300',
      icon: '⚠',
      pulse: 'animate-pulse'
    };
    if (aqi <= 150) return {
      glow: 'shadow-[0_0_40px_rgba(249,115,22,0.7)]',
      border: 'border-orange-400/50',
      bg: 'from-orange-400/20 to-orange-400/10',
      text: 'text-orange-300',
      icon: '⚠️',
      pulse: 'animate-pulse'
    };
    if (aqi <= 200) return {
      glow: 'shadow-[0_0_50px_rgba(239,68,68,0.8)]',
      border: 'border-red-400/50',
      bg: 'from-red-400/20 to-red-400/10',
      text: 'text-red-300',
      icon: '🚨',
      pulse: 'animate-pulse'
    };
    return {
      glow: 'shadow-[0_0_60px_rgba(139,92,246,0.9)]',
      border: 'border-purple-400/50',
      bg: 'from-purple-400/20 to-purple-400/10',
      text: 'text-purple-300',
      icon: '🚨',
      pulse: 'animate-pulse'
    };
  };

  const alert = getAlertConfig();
  const isHighRisk = aqi > 100;
  const isRespiratoryRisk = aqi > 150;

  if (!isHighRisk || !alert) return null;

  return (
    <div className={`glass-panel rounded-3xl p-6 border-2 ${alert.border} bg-gradient-to-r ${alert.bg} ${alert.glow} ${alert.pulse} float-slow`}>
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${alert.bg} flex items-center justify-center border-2 ${alert.border} flex-shrink-0`}>
          <span className="text-3xl">{alert.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className={`font-display font-bold text-xl mb-2 ${alert.text}`}>
            {isRespiratoryRisk ? '⚠️ HIGH RISK ALERT - Respiratory Health Warning' : 'Air Quality Alert'}
          </h3>
          <p className={`${alert.text} text-base mb-2`}>
            Current AQI: <span className="font-bold text-2xl">{Math.round(aqi)}</span> - {status}
          </p>
          {isRespiratoryRisk && (
            <div className={`mt-3 p-3 rounded-xl bg-gradient-to-r ${alert.bg} border ${alert.border}`}>
              <p className={`${alert.text} font-semibold`}>
                ⚠️ People with respiratory conditions should take immediate precautions!
              </p>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse glow-green"></div>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
