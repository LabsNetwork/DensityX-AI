import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Circle, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// GLOBAL PRODUCTION ENDPOINT (NO LOCALHOST)
const API_BASE = "https://densityx-ai.onrender.com";
const VENUE_CENTER = [13.085, 80.2101];
const REFRESH_MS = 5000;

/**
 * Production-Ready Home Component with Fail-Safe Architecture
 * - Always renders content (no white screen)
 * - Error handling with fallback UI
 * - Real-time data from production backend
 * - Responsive layout with proper styling
 */
export default function Home() {
  const [crowd, setCrowd] = useState({ points: [], clusters: [] });
  const [density, setDensity] = useState({ clusters: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const clusters = density.clusters || [];
  const highRiskClusters = clusters.filter((c) => c.risk_flag);

  // Fetch data from production backend
  const fetchData = useCallback(async () => {
    try {
      console.log("📡 Fetching crowd data from:", `${API_BASE}/crowd/locations`);
      const crowdRes = await fetch(`${API_BASE}/crowd/locations`, { timeout: 10000 });
      if (!crowdRes.ok) throw new Error(`HTTP ${crowdRes.status}`);
      const crowdData = await crowdRes.json();

      console.log("📡 Fetching density data from:", `${API_BASE}/density`);
      const densityRes = await fetch(`${API_BASE}/density`, { timeout: 10000 });
      if (!densityRes.ok) throw new Error(`HTTP ${densityRes.status}`);
      const densityData = await densityRes.json();

      console.log("✅ Data loaded:", { points: crowdData.count, clusters: densityData.clusters?.length });

      setCrowd(crowdData);
      setDensity(densityData);
      setError("");
    } catch (err) {
      console.error("❌ API Error:", err);
      setError(`Backend connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const intervalId = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(intervalId);
  }, [autoRefresh, fetchData]);

  // FAIL-SAFE: Always render something
  if (error && loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        textAlign: "center",
        padding: "2rem",
      }}>
        <div>
          <h1>⚠️ Connection Error</h1>
          <p>{error}</p>
          <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>Trying to connect to backend...</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              background: "#fff",
              color: "#667eea",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Retry Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f5f5f5" }}>
      {/* Header */}
      <div style={{
        padding: "1rem 1.5rem",
        background: "linear-gradient(90deg, #333 0%, #1a1a1a 100%)",
        color: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: "0.5rem 0", fontSize: "1.5rem" }}>🗺️ DensityX Live Monitor</h1>
            <div style={{ fontSize: "0.85rem", color: error ? "#ff6b6b" : "#4ade80", fontWeight: "bold" }}>
              {error ? `⚠️ ${error}` : "🟢 Connected to Backend"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.9rem" }}>Active Points: <strong>{crowd.points?.length || 0}</strong></div>
            <div style={{ fontSize: "0.9rem" }}>Clusters: <strong>{clusters.length}</strong></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {loading && !error ? (
          // Loading State
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>⏳</div>
            <p>Loading map and real-time data...</p>
            <p style={{ fontSize: "0.85rem", color: "#666" }}>Connecting to: {API_BASE}</p>
          </div>
        ) : (
          // Map Container (Full Height)
          <div style={{ flex: 1, position: "relative" }}>
            <MapContainer
              center={VENUE_CENTER}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Crowd Points */}
              {(crowd.points || []).map((point, idx) => (
                <Circle
                  key={`point-${idx}`}
                  center={[point.lat, point.lon]}
                  radius={20}
                  color="#1e40af"
                  fillColor="#3b82f6"
                  fillOpacity={0.6}
                  weight={2}
                />
              ))}

              {/* Cluster Centroids */}
              {clusters.map((cluster) => (
                <CircleMarker
                  key={`cluster-${cluster.id}`}
                  center={[cluster.centroid_lat || cluster.lat, cluster.centroid_lon || cluster.lon]}
                  radius={cluster.risk_flag ? 14 : 10}
                  color={cluster.risk_flag ? "#dc2626" : "#16a34a"}
                  fillColor={cluster.risk_flag ? "#ef4444" : "#22c55e"}
                  fillOpacity={0.8}
                  weight={2}
                >
                  <Popup>
                    <strong>Cluster {String.fromCharCode(65 + (cluster.id % 26))}</strong><br />
                    Size: {cluster.cluster_size || cluster.size} people<br />
                    Risk: {cluster.risk_flag ? "🔴 HIGH" : "🟢 NORMAL"}
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>

            {/* Overlay Stats Panel */}
            <div style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              right: "1rem",
              background: "#fff",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1rem",
              zIndex: 500,
            }}>
              {/* Stats Cards */}
              <div style={{ padding: "0.75rem", background: "#f0f9ff", borderRadius: "4px" }}>
                <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: "600" }}>Total Points</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1e40af" }}>{crowd.points?.length || 0}</div>
              </div>
              <div style={{ padding: "0.75rem", background: "#f0fdf4", borderRadius: "4px" }}>
                <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: "600" }}>Active Clusters</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#16a34a" }}>{clusters.length}</div>
              </div>
              <div style={{ padding: "0.75rem", background: "#fef2f2", borderRadius: "4px" }}>
                <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: "600" }}>High Risk</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#dc2626" }}>{highRiskClusters.length}</div>
              </div>
              <div style={{ padding: "0.75rem", background: "#fef3c7", borderRadius: "4px" }}>
                <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: "600" }}>Density %</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#b45309" }}>
                  {Math.round(((crowd.points?.length || 0) / 200) * 100)}%
                </div>
              </div>

              {/* Controls */}
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => setAutoRefresh((v) => !v)}
                  style={{
                    flex: 1,
                    padding: "0.5rem 1rem",
                    background: autoRefresh ? "#3b82f6" : "#9ca3af",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.2s",
                  }}
                >
                  {autoRefresh ? "⏸ Pause" : "▶ Resume"}
                </button>
                <button
                  onClick={fetchData}
                  style={{
                    flex: 1,
                    padding: "0.5rem 1rem",
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.2s",
                  }}
                >
                  🔄 Refresh Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
