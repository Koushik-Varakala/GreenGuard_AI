import React, { useState, useEffect } from 'react';
import { startObservingEnvironment, stopObservingEnvironment } from '../agent/observe';
import { decideRisk } from '../agent/decide';
import { generateAlertMessage } from '../agent/act';

const EnvSafetyAgent = ({ isActive, onObservation, onAlert }) => {
  const [status, setStatus] = useState('Inactive');
  const [currentObservation, setCurrentObservation] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (isActive) {
      setStatus('Active');
      startObservingEnvironment(async (obs) => {
        setCurrentObservation(obs);
        onObservation?.(obs);

        if (obs.aqi !== null && obs.aqi !== undefined) {
          const decision = decideRisk({ aqi: obs.aqi, windSpeed: obs.windSpeed });
          const alertMsg = await generateAlertMessage(decision.severity, { aqi: obs.aqi, windSpeed: obs.windSpeed });
          const fullAlert = { ...decision, message: alertMsg };
          setAlert(fullAlert);
          onAlert?.(fullAlert);

          setStatus(`Monitoring - ${decision.severity} risk`);
        } else {
          setStatus('Monitoring - No data');
        }
      });
    } else {
      setStatus('Inactive');
      stopObservingEnvironment();
    }

    return () => {
      stopObservingEnvironment();
    };
  }, [isActive, onObservation, onAlert]);

  return (
    <div className="env-safety-agent bg-gray-800 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-semibold text-white mb-2">Environmental Safety Agent</h3>
      <p className="text-sm text-gray-300 mb-2">Status: {status}</p>
      {currentObservation && (
        <div className="text-sm text-gray-300">
          <p>Location: {currentObservation.location?.lat.toFixed(4)}, {currentObservation.location?.lng.toFixed(4)}</p>
          <p>AQI: {currentObservation.aqi || 'N/A'}</p>
          <p>Wind: {currentObservation.windSpeed || 'N/A'} m/s</p>
          <p>Temp: {currentObservation.temperature || 'N/A'}°C</p>
          <p>Humidity: {currentObservation.humidity || 'N/A'}%</p>
        </div>
      )}
      {alert && (
        <div className={`mt-2 p-2 rounded text-sm ${
          alert.severity === 'HIGH' ? 'bg-red-600' :
          alert.severity === 'MODERATE' ? 'bg-yellow-600' : 'bg-green-600'
        }`}>
          <p className="font-semibold">{alert.severity} Risk</p>
          <p>{alert.message}</p>
          <p className="text-xs">{alert.recommendedAction}</p>
        </div>
      )}
    </div>
  );
};

export default EnvSafetyAgent;