import React, { useEffect, useState } from "react";
import { findHighDensityClusters } from "../services/clusteringUtils";

export function AlertPanel({ clusters = [], threshold = 25 }) {
  const [isFlashing, setIsFlashing] = useState(false);
  const highDensityClusters = findHighDensityClusters(clusters, threshold);

  useEffect(() => {
    if (highDensityClusters.length > 0) {
      const interval = setInterval(() => {
        setIsFlashing((prev) => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setIsFlashing(false);
    }
  }, [highDensityClusters.length]);

  const hasAlerts = highDensityClusters.length > 0;

  return (
    <div
      style={{
        background: hasAlerts
          ? isFlashing
            ? "rgba(239, 68, 68, 0.3)"
            : "rgba(239, 68, 68, 0.1)"
          : "rgba(34, 197, 94, 0.1)",
        border: `2px solid ${
          hasAlerts ? "#ef4444" : "#22c55e"
        }`,
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
          fontSize: "1.1rem",
          fontWeight: "bold",
          color: hasAlerts ? "#ef4444" : "#22c55e",
        }}
      >
        {hasAlerts ? "🚨 ALERTS ACTIVE" : "✅ SYSTEM NORMAL"}
        {hasAlerts && <span style={{ fontSize: "0.9rem" }}>({highDensityClusters.length})</span>}
      </div>

      {hasAlerts ? (
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {highDensityClusters.map((cluster, idx) => (
            <div
              key={`alert-${idx}`}
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                borderRadius: "6px",
                padding: "10px",
                marginBottom: "8px",
                fontSize: "0.85rem",
                color: "#fca5a5",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                Cluster {cluster.cluster_id || idx + 1}
              </div>
              <div>👥 Users: {cluster.cluster_size}</div>
              <div>
                📍 Center:{" "}
                {(cluster.centroid?.lat ?? cluster.centroid_lat ?? 0)?.toFixed(4)},{" "}
                {(cluster.centroid?.lon ?? cluster.centroid_lon ?? 0)?.toFixed(4)}
              </div>
              <div style={{ color: "#fecaca", marginTop: "4px" }}>
                ⚠️ Exceeds threshold ({threshold} users)
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: "#86efac", fontSize: "0.9rem" }}>
          All clusters are within safe density levels.
        </div>
      )}
    </div>
  );
}
