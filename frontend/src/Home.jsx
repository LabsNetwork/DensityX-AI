import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// GLOBAL PRODUCTION ENDPOINT
const API_BASE = "https://densityx-ai.onrender.com";

function Home() {
  const [data, setData] = useState({ points: [], clusters: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      console.log("📡 Fetching from:", `${API_BASE}/crowd/locations`);
      const response = await fetch(`${API_BASE}/crowd/locations`, { timeout: 10000 });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const result = await response.json();
      console.log("✅ Data received:", result);
      setData(result);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ERROR STATE
  if (error) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>⚠️ Connection Issue</h1>
        <p style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>Unable to reach the backend server</p>
        <p style={{ color: '#ddd', margin: '0.5rem 0' }}>{error}</p>
        <p style={{ color: '#aaa', margin: '1rem 0' }}>Check: <a href={API_BASE} target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff', textDecoration: 'underline' }}>{API_BASE}</a></p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '2rem',
            padding: '12px 30px',
            fontSize: '1rem',
            background: '#00d4ff',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  // LOADING STATE
  if (loading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        flexDirection: 'column'
      }}>
        <h1 style={{ margin: '0 0 1rem 0' }}>⏳ Loading...</h1>
        <p>Connecting to: {API_BASE}</p>
      </div>
    );
  }

  // SUCCESS STATE
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      {/* Header Overlay */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>🗺️ DensityX Live Monitor</h2>
        <div style={{ fontSize: '0.9rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>👥 Total Points: <strong>{data.points?.length || 0}</strong></div>
          <div>📍 Active Clusters: <strong>{data.clusters?.length || 0}</strong></div>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[13.085, 80.2101]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Crowd Points */}
        {data.points?.map((point, idx) => (
          <CircleMarker
            key={`point-${idx}`}
            center={[point.lat, point.lon]}
            radius={5}
            color="#1e40af"
            fillColor="#3b82f6"
            fillOpacity={0.6}
            weight={1}
          >
            <Popup>User Location</Popup>
          </CircleMarker>
        ))}

        {/* Clusters */}
        {data.clusters?.map((cluster, idx) => (
          <CircleMarker
            key={`cluster-${idx}`}
            center={[cluster.centroid_lat || cluster.lat, cluster.centroid_lon || cluster.lon]}
            radius={Math.max(10, (cluster.cluster_size || cluster.size || 1) / 2)}
            color={cluster.risk_flag ? '#dc2626' : '#16a34a'}
            fillColor={cluster.risk_flag ? '#ef4444' : '#22c55e'}
            fillOpacity={0.8}
            weight={3}
          >
            <Popup>
              <strong>Cluster {idx + 1}</strong><br />
              Size: {cluster.cluster_size || cluster.size} people<br />
              Risk: {cluster.risk_flag ? '🔴 HIGH' : '🟢 LOW'}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Bottom Stats Panel */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px',
        backdropFilter: 'blur(10px)',
        zIndex: 999
      }}>
        <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '4px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Total Points</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.points?.length || 0}</div>
        </div>
        <div style={{ padding: '10px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '4px', borderLeft: '4px solid #22c55e' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Active Clusters</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.clusters?.length || 0}</div>
        </div>
        <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '4px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>High Risk</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.clusters?.filter(c => c.risk_flag)?.length || 0}</div>
        </div>
        <div style={{ padding: '10px', background: 'rgba(255, 193, 7, 0.2)', borderRadius: '4px', borderLeft: '4px solid #ffc107' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Density %</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Math.round(((data.points?.length || 0) / 200) * 100)}%</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
