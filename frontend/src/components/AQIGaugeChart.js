import React from 'react';

const AQIGaugeChart = ({ aqi, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-green-200 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-green-100 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  // AQI ranges and colors
  const getAQIRange = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: '#22c55e', description: 'Air quality is satisfactory' };
    if (aqi <= 100) return { level: 'Moderate', color: '#eab308', description: 'Air quality is acceptable' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#f97316', description: 'Sensitive individuals may experience issues' };
    if (aqi <= 200) return { level: 'Unhealthy', color: '#ef4444', description: 'Everyone may experience health effects' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#dc2626', description: 'Health alert for everyone' };
    return { level: 'Hazardous', color: '#7c2d12', description: 'Emergency conditions' };
  };

  const aqiInfo = getAQIRange(aqi || 0);

  // Calculate gauge angle (0-180 degrees for semicircle)
  const getGaugeAngle = (value) => {
    const maxAQI = 500;
    const maxAngle = 180;
    return Math.min((value / maxAQI) * maxAngle, maxAngle);
  };

  const angle = getGaugeAngle(aqi || 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">🎯 AQI Gauge</h3>
        <p className="text-sm text-gray-600">Real-time air quality indicator</p>
      </div>

      <div className="relative flex justify-center">
        {/* Gauge Background */}
        <div className="relative w-64 h-32">
          <svg width="256" height="128" viewBox="0 0 256 128" className="overflow-visible">
            {/* Background arc */}
            <path
              d="M 28 128 A 100 100 0 0 1 228 128"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Colored segments */}
            <path
              d="M 28 128 A 100 100 0 0 1 78 128"
              fill="none"
              stroke="#22c55e"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M 78 128 A 100 100 0 0 1 128 128"
              fill="none"
              stroke="#eab308"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M 128 128 A 100 100 0 0 1 178 128"
              fill="none"
              stroke="#f97316"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M 178 128 A 100 100 0 0 1 228 128"
              fill="none"
              stroke="#ef4444"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Needle */}
            <g transform={`rotate(${angle} 128 128)`}>
              <line
                x1="128"
                y1="128"
                x2="128"
                y2="40"
                stroke="#374151"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="128" cy="128" r="5" fill="#374151" />
            </g>

            {/* Center point */}
            <circle cx="128" cy="128" r="8" fill="white" stroke="#d1d5db" strokeWidth="2" />
          </svg>

          {/* Scale labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
            <span>0</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>400+</span>
          </div>
        </div>
      </div>

      {/* AQI Value and Info */}
      <div className="text-center mt-6">
        <div className="text-4xl font-bold mb-2" style={{ color: aqiInfo.color }}>
          {aqi || 0}
        </div>
        <div className="text-lg font-semibold text-gray-800 mb-1">
          {aqiInfo.level}
        </div>
        <div className="text-sm text-gray-600 max-w-xs mx-auto">
          {aqiInfo.description}
        </div>
      </div>

      {/* AQI Scale Legend */}
      <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600">Good (0-50)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600">Moderate (51-100)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span className="text-gray-600">Unhealthy (101-150)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600">Very Unhealthy (151-200)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-700 rounded"></div>
          <span className="text-gray-600">Hazardous (201+)</span>
        </div>
      </div>
    </div>
  );
};

export default AQIGaugeChart;