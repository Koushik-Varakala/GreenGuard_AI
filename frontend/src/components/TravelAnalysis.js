import React, { useState } from 'react';
import { aqiAPI } from '../services/api';

const TravelAnalysis = () => {
  const [sourceLat, setSourceLat] = useState('');
  const [sourceLon, setSourceLon] = useState('');
  const [destLat, setDestLat] = useState('');
  const [destLon, setDestLon] = useState('');
  const [travelMode, setTravelMode] = useState('driving');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await aqiAPI.calculateTravelExposure(
        parseFloat(sourceLat),
        parseFloat(sourceLon),
        parseFloat(destLat),
        parseFloat(destLon),
        travelMode
      );
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze travel route');
    } finally {
      setLoading(false);
    }
  };

  const getExposureConfig = (level) => {
    if (level.toLowerCase().includes('low')) {
      return {
        glow: 'shadow-[0_0_20px_rgba(0,255,136,0.4)]',
        border: 'border-neon-green/50',
        bg: 'from-neon-green/20 to-neon-green/10',
        text: 'text-neon-green',
      };
    }
    if (level.toLowerCase().includes('moderate')) {
      return {
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
        border: 'border-yellow-400/50',
        bg: 'from-yellow-400/20 to-yellow-400/10',
        text: 'text-yellow-300',
      };
    }
    if (level.toLowerCase().includes('high')) {
      return {
        glow: 'shadow-[0_0_30px_rgba(249,115,22,0.5)]',
        border: 'border-orange-400/50',
        bg: 'from-orange-400/20 to-orange-400/10',
        text: 'text-orange-300',
      };
    }
    return {
      glow: 'shadow-[0_0_40px_rgba(239,68,68,0.6)]',
      border: 'border-red-400/50',
      bg: 'from-red-400/20 to-red-400/10',
      text: 'text-red-300',
    };
  };

  return (
    <div className="glass-panel rounded-3xl p-8 hover:shadow-neon-green transition-all duration-500 relative overflow-hidden">
      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-cyan/5 pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 flex items-center justify-center border-2 border-neon-green/50">
          <svg className="w-8 h-8 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-neon-green mb-1">Travel Exposure Analysis</h2>
          <p className="text-sm text-neon-cyan/70 font-light">Route Pollution Assessment</p>
        </div>
      </div>
      
      <form onSubmit={handleAnalyze} className="relative z-10 space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-neon-cyan mb-2 uppercase tracking-wider">Source Latitude</label>
            <input
              type="number"
              step="any"
              value={sourceLat}
              onChange={(e) => setSourceLat(e.target.value)}
              className="w-full glass-cosmic border-2 border-neon-green/30 rounded-xl px-4 py-3 text-neon-green bg-cosmic-dark/50 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all placeholder:text-neon-cyan/30"
              placeholder="17.3850"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neon-cyan mb-2 uppercase tracking-wider">Source Longitude</label>
            <input
              type="number"
              step="any"
              value={sourceLon}
              onChange={(e) => setSourceLon(e.target.value)}
              className="w-full glass-cosmic border-2 border-neon-green/30 rounded-xl px-4 py-3 text-neon-green bg-cosmic-dark/50 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all placeholder:text-neon-cyan/30"
              placeholder="78.4867"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neon-cyan mb-2 uppercase tracking-wider">Destination Latitude</label>
            <input
              type="number"
              step="any"
              value={destLat}
              onChange={(e) => setDestLat(e.target.value)}
              className="w-full glass-cosmic border-2 border-neon-green/30 rounded-xl px-4 py-3 text-neon-green bg-cosmic-dark/50 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all placeholder:text-neon-cyan/30"
              placeholder="28.6139"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neon-cyan mb-2 uppercase tracking-wider">Destination Longitude</label>
            <input
              type="number"
              step="any"
              value={destLon}
              onChange={(e) => setDestLon(e.target.value)}
              className="w-full glass-cosmic border-2 border-neon-green/30 rounded-xl px-4 py-3 text-neon-green bg-cosmic-dark/50 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all placeholder:text-neon-cyan/30"
              placeholder="77.2090"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-neon-cyan mb-2 uppercase tracking-wider">Travel Mode</label>
          <select
            value={travelMode}
            onChange={(e) => setTravelMode(e.target.value)}
            className="w-full glass-cosmic border-2 border-neon-green/30 rounded-xl px-4 py-3 text-neon-green bg-cosmic-dark/50 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all cursor-pointer"
          >
            <option value="driving" className="bg-cosmic-dark">🚗 Driving</option>
            <option value="walking" className="bg-cosmic-dark">🚶 Walking</option>
            <option value="cycling" className="bg-cosmic-dark">🚴 Cycling</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full glass-panel bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 hover:from-neon-green/30 hover:to-neon-cyan/30 text-neon-green py-4 px-6 rounded-xl font-display font-bold uppercase tracking-wider disabled:opacity-50 transition-all duration-300 border-2 border-neon-green/50 hover:shadow-neon-green hover:scale-[1.02]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Analyzing...
            </span>
          ) : (
            '🔍 Analyze Route'
          )}
        </button>
      </form>

      {error && (
        <div className="relative z-10 glass-cosmic bg-red-400/10 border-2 border-red-400/50 text-red-300 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {results && (
        <div className="relative z-10 space-y-6 animate-fade-in">
          {(() => {
            const config = getExposureConfig(results.exposure_level);
            return (
              <div className={`bg-gradient-to-r ${config.bg} border-2 ${config.border} rounded-2xl p-6 ${config.glow}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.bg} flex items-center justify-center border ${config.border}`}>
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div>
                    <p className={`font-display font-bold text-lg mb-1 ${config.text}`}>Exposure Level</p>
                    <p className={`text-sm ${config.text} opacity-80`}>{results.exposure_level}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Source AQI', value: results.source_aqi },
              { label: 'Destination AQI', value: results.dest_aqi },
              { label: 'Route Average', value: results.route_average_aqi },
            ].map((item, idx) => (
              <div key={idx} className="glass-cosmic rounded-2xl p-4 border border-neon-cyan/20 hover:border-neon-green/50 hover:shadow-neon-cyan transition-all">
                <div className="text-xs text-neon-cyan/60 mb-2 uppercase tracking-wider">{item.label}</div>
                <div className="text-3xl font-display font-bold text-neon-green">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="glass-cosmic border-2 border-yellow-400/30 rounded-2xl p-4 bg-gradient-to-r from-yellow-400/10 to-orange-400/10">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-display font-semibold text-yellow-300 mb-1">Risk Assessment</p>
                <p className="text-sm text-yellow-200/80">{results.risk_assessment}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-display font-semibold text-neon-green uppercase tracking-wider">Recommendations</h3>
            </div>
            <div className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <div key={index} className="glass-cosmic rounded-xl p-3 text-sm text-neon-cyan/90 border border-neon-green/20 hover:border-neon-green/50 transition-all">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelAnalysis;
