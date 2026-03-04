import React, { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getClusterDensityLevel, getClusterRadius } from "../services/clusteringUtils";

export function MapView({ points = [], clusters = [], onClusterClick = null }) {
  const [selectedCluster, setSelectedCluster] = useState(null);

  const handleClusterClick = (cluster) => {
    setSelectedCluster(cluster);
    if (onClusterClick) onClusterClick(cluster);
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={[13.085, 80.2101]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* User Points - Small blue dots */}
        {points.map((point, idx) => (
          <CircleMarker
            key={`point-${idx}`}
            center={[point.lat, point.lon]}
            radius={4}
            color="#3b82f6"
            fillColor="#60a5fa"
            fillOpacity={0.7}
            weight={1}
          >
            <Popup>
              <div style={{ fontSize: "0.85rem" }}>
                <strong>User Location</strong>
                <br />
                Lat: {point.lat?.toFixed(4)}
                <br />
                Lon: {point.lon?.toFixed(4)}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Cluster Centroids - Size-based circles with risk coloring */}
        {clusters.map((cluster, idx) => {
          const { color, label } = getClusterDensityLevel(cluster.cluster_size || 0);
          const radius = getClusterRadius(cluster.cluster_size || 0);
          const lat = cluster.centroid?.lat ?? cluster.centroid_lat ?? cluster.lat ?? 0;
          const lon = cluster.centroid?.lon ?? cluster.centroid_lon ?? cluster.lon ?? 0;

          return (
            <CircleMarker
              key={`cluster-${idx}`}
              center={[lat, lon]}
              radius={radius}
              color={color}
              fillColor={color}
              fillOpacity={0.8}
              weight={2}
              eventHandlers={{
                click: () => handleClusterClick(cluster),
              }}
            >
              <Popup>
                <div style={{ fontSize: "0.9rem", minWidth: "200px" }}>
                  <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                    Cluster {cluster.cluster_id || idx + 1}
                  </div>
                  <div>
                    <strong>Size:</strong> {cluster.cluster_size} users
                  </div>
                  <div>
                    <strong>Center:</strong> {lat?.toFixed(4)}, {lon?.toFixed(4)}
                  </div>
                  <div>
                    <strong>Status:</strong> {label}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Map info overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "0.9rem",
          zIndex: 1000,
        }}
      >
        <div style={{ fontWeight: "bold" }}>📍 Map Info</div>
        <div style={{ marginTop: "6px", fontSize: "0.85rem", color: "#aaa" }}>
          Points: {points.length} | Clusters: {clusters.length}
        </div>
      </div>
    </div>
  );
}
