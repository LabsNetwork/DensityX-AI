import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const API_BASE = "https://densityx-ai.onrender.com";

function Home() {
  const [data, setData] = useState({ points: [], clusters: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE}/crowd/locations`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const result = await response.json();
      setData(result);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1>⚠️ Error</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} style={{
          marginTop: '1rem',
          padding: '10px 20px',
          fontSize: '1rem',
          background: '#00d4ff',
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          🔄 Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>⏳ Loading...</h1>
        <p>Fetching data from {API_BASE}</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      <MapContainer
        center={[13.085, 80.2101]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {data.points?.map((point, idx) => (
          <CircleMarker
            key={`point-${idx}`}
            center={[point.lat, point.lon]}
            radius={4}
            color="#3b82f6"
            fillColor="#3b82f6"
            fillOpacity={0.7}
            weight={1}
          />
        ))}

        {data.clusters?.map((cluster, idx) => (
          <CircleMarker
            key={`cluster-${idx}`}
            center={[cluster.centroid.lat, cluster.centroid.lon]}
            radius={Math.max(8, cluster.cluster_size / 3)}
            color={cluster.risk_flag ? '#ef4444' : '#22c55e'}
            fillColor={cluster.risk_flag ? '#ef4444' : '#22c55e'}
            fillOpacity={0.8}
            weight={2}
          >
            <Popup>
              Cluster {cluster.cluster_id}<br/>
              Size: {cluster.cluster_size}<br/>
              Risk: {cluster.risk_flag ? '🔴 HIGH' : '🟢 LOW'}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '12px',
        borderRadius: '6px',
        zIndex: 1000
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>🗺️ DensityX Monitor</div>
        <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
          Points: {data.points?.length} | Clusters: {data.clusters?.length}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '12px',
        borderRadius: '6px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '8px',
        zIndex: 999
      }}>
        <div><span style={{ color: '#aaa' }}>Total:</span> {data.points?.length}</div>
        <div><span style={{ color: '#aaa' }}>Clusters:</span> {data.clusters?.length}</div>
        <div><span style={{ color: '#aaa' }}>Risk:</span> {data.clusters?.filter(c => c.risk_flag)?.length}</div>
        <div><span style={{ color: '#aaa' }}>Density:</span> {Math.round(((data.points?.length || 0) / 200) * 100)}%</div>
      </div>
    </div>
  );
}

export default Home;

