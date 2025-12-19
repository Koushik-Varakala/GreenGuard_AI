import React, { useState, useEffect, useRef, useCallback } from "react";

const RealTimeMonitor = ({
  latitude = 40.7128,
  longitude = -74.006,
  onDataUpdate,
}) => {
  const [realtimeData, setRealtimeData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [manualData, setManualData] = useState({
    temperature: 22,
    humidity: 65,
    windSpeed: 3.5,
    co2: 400,
    pm25: 15,
    pm10: 25,
  });

  const wsRef = useRef(null);

  /* ------------------ Helpers ------------------ */

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return "#00ff88";
    if (aqi <= 100) return "#ffff00";
    if (aqi <= 150) return "#ff8800";
    if (aqi <= 200) return "#ff4444";
    if (aqi <= 300) return "#aa00aa";
    return "#660000";
  };

  const getStatusColor = (status) => {
    if (status === "connected") return "#00ff88";
    if (status === "error") return "#ff8800";
    return "#ff4444";
  };

  const updateManualData = (field, value) => {
    const updated = { ...manualData, [field]: Number(value) };
    setManualData(updated);
    onDataUpdate?.(updated);
  };

  const toggleMode = () => {
    setIsEditing((prev) => !prev);
    onDataUpdate?.(manualData);
  };

  const getDisplayData = () => {
    if (isEditing) {
      return {
        aqi: {
          value: 50,
          status: "Good",
          pm25: manualData.pm25,
          co2: manualData.co2,
        },
        weather: {
          temperature: manualData.temperature,
          humidity: manualData.humidity,
          wind_speed: manualData.windSpeed,
          description: "Manual Input",
        },
      };
    }
    return realtimeData;
  };

  /* ------------------ WebSocket ------------------ */

  const connectWebSocket = useCallback(() => {
    try {
      const ws = new WebSocket(
        `ws://localhost:8020/ws/realtime-monitoring?latitude=${latitude}&longitude=${longitude}`
      );

      wsRef.current = ws;

      ws.onopen = () => setConnectionStatus("connected");

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === "realtime_update") {
          setRealtimeData(data);
          setAlerts(data.alerts || []);
          setIsLoading(false);
        }
      };

      ws.onclose = () => {
        setConnectionStatus("disconnected");
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = () => setConnectionStatus("error");
    } catch {
      setConnectionStatus("error");
    }
  }, [latitude, longitude]);

  useEffect(() => {
    connectWebSocket();
    return () => wsRef.current?.close();
  }, [connectWebSocket]);

  const displayData = getDisplayData();

  /* ------------------ UI ------------------ */

  return (
    <div className="glass-panel rounded-3xl p-8">

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-neon-green">
            Real-Time Monitor
            {isEditing && (
              <span className="ml-2 text-xs bg-neon-green text-black px-2 py-1 rounded">
                MANUAL
              </span>
            )}
          </h2>
          <p className="text-neon-cyan/70">
            {isEditing ? "Manual Mode" : "Live Data Streaming"}
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getStatusColor(connectionStatus) }}
            />
            <span className="text-sm text-neon-cyan">{connectionStatus}</span>
          </div>

          <button
            onClick={toggleMode}
            className="px-3 py-1 rounded-full text-xs bg-neon-cyan/20 text-neon-cyan border"
          >
            {isEditing ? "Real-Time Mode" : "Manual Mode"}
          </button>
        </div>
      </div>

      {/* BODY */}
      {isLoading && !isEditing ? (
        <div className="text-center py-12">
          <div className="animate-spin w-10 h-10 border-4 border-neon-green border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-neon-cyan/70">Connecting...</p>
        </div>
      ) : displayData ? (
        <div className="space-y-6">

          {/* AQI + WEATHER */}
          <div className="grid grid-cols-1 md:grid-cols-0 gap-6">
            <div className="text-center">

              {/* AQI */}
              <div className="relative mb-4">
                <div
                  className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-2xl font-bold border-4"
                  style={{
                    backgroundColor: `${getAQIColor(displayData.aqi?.value || 50)}20`,
                    borderColor: getAQIColor(displayData.aqi?.value || 50),
                    color: getAQIColor(displayData.aqi?.value || 50),
                  }}
                >
                  {Math.round(displayData.aqi?.value || 50)}
                </div>
                <p className="text-neon-cyan font-semibold">
                  {displayData.aqi?.status || "Good"}
                </p>
              </div>

              {/* WEATHER */}
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">
                  {displayData.weather?.temperature > 25
                    ? "☀️"
                    : displayData.weather?.temperature < 15
                    ? "❄️"
                    : "⛅"}
                </div>

                {isEditing ? (
                  <input
                    type="number"
                    value={manualData.temperature}
                    onChange={(e) =>
                      updateManualData("temperature", e.target.value)
                    }
                    className="bg-transparent text-2xl text-neon-green border-b w-20 text-center"
                  />
                ) : (
                  <div className="text-2xl text-neon-green">
                    {Math.round(displayData.weather?.temperature || 22)}°C
                  </div>
                )}

                <p className="text-neon-cyan text-sm">
                  {displayData.weather?.description || "Clear sky"}
                </p>
              </div>

              {/* METRICS */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Humidity</span>
                  <span>{displayData.weather?.humidity || 65}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Wind</span>
                  <span>{displayData.weather?.wind_speed || 3.5} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span>PM2.5</span>
                  <span>{displayData.aqi?.pm25 || 15} μg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span>CO₂</span>
                  <span>{displayData.aqi?.co2 || 400} ppm</span>
                </div>
              </div>
            </div>

            {/* ALERTS */}
            {alerts.length > 0 && (
              <div>
                <h3 className="text-neon-green font-semibold mb-2">
                  Alerts
                </h3>
                {alerts.map((a, i) => (
                  <div
                    key={i}
                    className="p-3 mb-2 rounded bg-red-500/10 border border-red-500 text-red-400"
                  >
                    {a.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neon-cyan/70">
            No data available
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(RealTimeMonitor);
