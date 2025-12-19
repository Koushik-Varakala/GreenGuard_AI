import React, { useState, useEffect, useRef, useCallback } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

/* global google */

const MapView = ({ source, destination, routeData }) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [safetyAdvice, setSafetyAdvice] = useState([]);
  const [mapError, setMapError] = useState(null);

  // Google Maps API Key - Replace with your actual key from Google Cloud Console
  // Enable Maps JavaScript API, Directions API, and Places API
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

  useEffect(() => {
    setOptions({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry', 'routes']
    });

    importLibrary('maps').then(() => {
      initMap();
      setMapLoaded(true);
    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
      setMapError('Failed to load Google Maps. Please check your API key and internet connection.');
      setMapLoaded(true); // Still set to true to show error UI
    });
  }, [GOOGLE_MAPS_API_KEY]);

  const initMap = () => {
    if (!mapRef.current) return;

    // eslint-disable-next-line no-undef
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 40.7128, lng: -74.0060 },
      zoom: 10,
      styles: [
        // Custom map styles for environmental theme
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e9e9e9' }]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }]
        }
      ]
    });

    googleMapRef.current = map;
    // eslint-disable-next-line no-undef
    directionsServiceRef.current = new google.maps.DirectionsService();
    // eslint-disable-next-line no-undef
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#00ff88',
        strokeWeight: 6
      }
    });

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(pos);
        },
        () => {
          console.log('Geolocation failed');
        }
      );
    }
  };

  const analyzeRoute = useCallback((directionsResult) => {
    // Analyze route for environmental risks based on route data
    const advice = [];

    if (routeData) {
      if (routeData.average_aqi > 100) {
        advice.push(`Unhealthy air quality along route (AQI: ${routeData.average_aqi}) - wear N95 mask`);
      }
      if (routeData.average_wind_speed > 8) {
        advice.push(`Strong winds (${routeData.average_wind_speed} m/s) - reduce speed and be cautious`);
      }
      if (routeData.average_co2 > 500) {
        advice.push(`High CO₂ levels (${routeData.average_co2} ppm) - avoid exertion`);
      }
      if (routeData.travel_risk_level === 'High') {
        advice.push('High overall risk - consider alternative routes or times');
      }
    }

    setSafetyAdvice(advice);

    // Color code the route based on risks
    colorRoute(directionsResult.routes[0].overview_path, routeData);
  }, [routeData]);

  const calculateRoute = useCallback(() => {
    if (!directionsServiceRef.current || !directionsRendererRef.current) return;

    const request = {
      origin: source,
      destination: destination,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.BICYCLING,
      optimizeWaypoints: true
    };

    directionsServiceRef.current.route(request, (result, status) => {
      // eslint-disable-next-line no-undef
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRendererRef.current.setDirections(result);
        analyzeRoute(result);
      } else {
        console.error('Directions request failed:', status);
        setSafetyAdvice(['Unable to calculate route. Please check locations and try again.']);
      }
    });
  }, [source, destination, analyzeRoute]);

  useEffect(() => {
    if (!mapLoaded || !source || !destination) return;

    calculateRoute();
  }, [mapLoaded, source, destination, calculateRoute]);

  const colorRoute = (path, routeData) => {
    if (!googleMapRef.current) return;

    // Color based on overall risk level
    let color = '#00ff88'; // Green - safe
    if (routeData?.travel_risk_level === 'Medium') color = '#ffff00'; // Yellow
    if (routeData?.travel_risk_level === 'High') color = '#ff4444'; // Red

    // Apply color to the entire route
    directionsRendererRef.current.setOptions({
      polylineOptions: {
        strokeColor: color,
        strokeWeight: 6
      }
    });
  };

  return (
    <div className="flex h-96 md:h-[600px]">
      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-6">
              <div className="text-red-500 mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Map Unavailable</h3>
              <p className="text-gray-600 text-sm mb-4">{mapError}</p>
              <div className="text-left text-sm text-gray-500">
                <p><strong>Route Summary:</strong></p>
                <p>From: {source ? `${source.lat.toFixed(4)}, ${source.lng.toFixed(4)}` : 'Not set'}</p>
                <p>To: {destination ? `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}` : 'Not set'}</p>
                {routeData && (
                  <div className="mt-2">
                    <p>Average AQI: {routeData.average_aqi || 'N/A'}</p>
                    <p>Risk Level: {routeData.travel_risk_level || 'N/A'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Information Panel */}
      <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🚴 Rider Safety Advice</h2>

        {safetyAdvice.length > 0 ? (
          <div className="space-y-3">
            {safetyAdvice.map((advice, index) => (
              <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <p className="text-sm text-gray-700">{advice}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No specific safety concerns detected for this route.</p>
        )}

        {/* Route Summary */}
        {routeData && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Route Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Average AQI:</span>
                <span className="font-semibold">{routeData.average_aqi || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Average CO₂:</span>
                <span className="font-semibold">{routeData.average_co2 || 'N/A'} ppm</span>
              </div>
              <div className="flex justify-between">
                <span>Wind Speed:</span>
                <span className="font-semibold">{routeData.average_wind_speed || 'N/A'} m/s</span>
              </div>
              <div className="flex justify-between">
                <span>Risk Level:</span>
                <span className={`font-semibold ${
                  routeData.travel_risk_level === 'Low' ? 'text-green-600' :
                  routeData.travel_risk_level === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {routeData.travel_risk_level || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Risk Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm">Safe (Low Risk)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span className="text-sm">Moderate Risk</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm">High Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;