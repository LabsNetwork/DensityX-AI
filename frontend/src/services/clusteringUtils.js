// Clustering visualization utilities
export const getClusterDensityLevel = (size) => {
  if (size >= 21) return { level: "HIGH", color: "#ef4444", label: "🔴 HIGH RISK" };
  if (size >= 6) return { level: "MEDIUM", color: "#f59e0b", label: "🟡 MEDIUM" };
  return { level: "LOW", color: "#22c55e", label: "🟢 LOW" };
};

export const getClusterRadius = (size) => {
  return Math.max(8, Math.min(25, 6 + size / 3));
};

export const getDensityPercentage = (pointCount, maxPoints = 200) => {
  return Math.round((pointCount / maxPoints) * 100);
};

export const findHighDensityClusters = (clusters, threshold = 25) => {
  return (clusters || []).filter(c => c.cluster_size >= threshold);
};

export const calculateClusterStats = (clusters = []) => {
  const total = clusters.length;
  const highRisk = findHighDensityClusters(clusters, 25).length;
  const totalUsers = clusters.reduce((sum, c) => sum + (c.cluster_size || 0), 0);
  
  return {
    total,
    highRisk,
    totalUsers,
    avgSize: total > 0 ? (totalUsers / total).toFixed(1) : 0,
  };
};
