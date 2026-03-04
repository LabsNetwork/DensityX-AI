import React from "react";
import { calculateClusterStats, getDensityPercentage } from "../services/clusteringUtils";

export function StatsPanel({ points = [], clusters = [] }) {
  const stats = calculateClusterStats(clusters);
  const densityPercent = getDensityPercentage(points.length);

  const statCards = [
    {
      label: "Total Users",
      value: points.length,
      icon: "👥",
      color: "#3b82f6",
    },
    {
      label: "Active Clusters",
      value: stats.total,
      icon: "📍",
      color: "#22c55e",
    },
    {
      label: "High Density",
      value: stats.highRisk,
      icon: "🚨",
      color: "#ef4444",
    },
    {
      label: "System Density",
      value: `${densityPercent}%`,
      icon: "📊",
      color: "#f59e0b",
    },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {statCards.map((card, idx) => (
          <div
            key={idx}
            style={{
              background: `rgba(${
                card.color === "#3b82f6"
                  ? "59, 130, 246"
                  : card.color === "#22c55e"
                  ? "34, 197, 94"
                  : card.color === "#ef4444"
                  ? "239, 68, 68"
                  : "245, 158, 11"
              }, 0.1)`,
              border: `1px solid ${card.color}`,
              borderRadius: "8px",
              padding: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "0.8rem", color: "#aaa", marginBottom: "4px" }}>
                {card.label}
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: card.color }}>
                {card.value}
              </div>
            </div>
            <div style={{ fontSize: "2rem" }}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Cluster Details */}
      {clusters.length > 0 && (
        <div>
          <div style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "12px", color: "#a0aec0" }}>
            📋 Cluster Details
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {clusters.map((cluster, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(30, 58, 138, 0.5)",
                  border: "1px solid rgba(0, 212, 255, 0.2)",
                  borderRadius: "6px",
                  padding: "10px",
                  marginBottom: "8px",
                  fontSize: "0.8rem",
                }}
              >
                <div style={{ fontWeight: "bold", color: "#00d4ff", marginBottom: "4px" }}>
                  Cluster {cluster.cluster_id || idx + 1}
                </div>
                <div style={{ color: "#cbd5e1" }}>
                  <div>📍 Size: {cluster.cluster_size} users</div>
                  <div>
                    📌 Lat:{" "}
                    {(cluster.centroid?.lat ?? cluster.centroid_lat ?? 0)?.toFixed(4)}
                  </div>
                  <div>
                    📌 Lon:{" "}
                    {(cluster.centroid?.lon ?? cluster.centroid_lon ?? 0)?.toFixed(4)}
                  </div>
                  <div style={{ marginTop: "4px" }}>
                    <span
                      style={{
                        background:
                          cluster.cluster_size >= 21
                            ? "rgba(239, 68, 68, 0.3)"
                            : cluster.cluster_size >= 6
                            ? "rgba(245, 158, 11, 0.3)"
                            : "rgba(34, 197, 94, 0.3)",
                        color:
                          cluster.cluster_size >= 21
                            ? "#fca5a5"
                            : cluster.cluster_size >= 6
                            ? "#fcd34d"
                            : "#86efac",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                      }}
                    >
                      {cluster.cluster_size >= 21
                        ? "HIGH DENSITY"
                        : cluster.cluster_size >= 6
                        ? "MEDIUM DENSITY"
                        : "LOW DENSITY"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
