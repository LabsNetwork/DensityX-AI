# density/dbscan.py
# Run DBSCAN on (lat, lon) points; return cluster count, sizes, high-risk flags.

from typing import Any, Dict, List, Tuple

import numpy as np
from sklearn.cluster import DBSCAN


def _to_xy_meters(points: List[Dict[str, Any]]) -> Tuple[np.ndarray, float]:
    """Convert lat/lon to approximate meters using a local projection."""
    if not points:
        return np.empty((0, 2)), 0.0
    mean_lat = np.mean([p["lat"] for p in points])
    # Approx conversions
    meters_per_deg_lat = 111_320
    meters_per_deg_lon = 111_320 * np.cos(np.deg2rad(mean_lat))
    xy = np.array(
        [
            [
                p["lon"] * meters_per_deg_lon,
                p["lat"] * meters_per_deg_lat,
            ]
            for p in points
        ],
        dtype=np.float64,
    )
    return xy, meters_per_deg_lon


def run_dbscan(
    points: List[Dict[str, Any]],
    eps_meters: float,
    min_samples: int,
    alert_threshold: int = 80,
) -> Dict[str, Any]:
    """
    Run DBSCAN on a list of points with 'lat' and 'lon' keys, using an
    approximate meter-scale projection. Returns clusters with centroids and alert flag.
    """
    if len(points) < 2:
        return {
            "cluster_count": 0,
            "cluster_sizes": [],
            "cluster_labels": [],
            "risk_flags": [],
            "point_count": len(points),
            "clusters": [],
        }

    X, _ = _to_xy_meters(points)
    clustering = DBSCAN(eps=eps_meters, min_samples=min_samples).fit(X)
    labels = clustering.labels_
    unique, counts = np.unique(labels[labels >= 0], return_counts=True)
    cluster_sizes = counts.tolist()
    cluster_count = len(cluster_sizes)

    clusters_with_centroids: List[Dict[str, Any]] = []
    for uid, cnt in zip(unique, counts):
        mask = labels == uid
        cluster_pts = [points[i] for i, keep in enumerate(mask) if keep]
        centroid_lat = float(np.mean([p["lat"] for p in cluster_pts]))
        centroid_lon = float(np.mean([p["lon"] for p in cluster_pts]))
        size_int = int(cnt)
        clusters_with_centroids.append(
            {
                "id": int(uid),
                "size": size_int,
                "risk_flag": size_int >= alert_threshold,
                "centroid_lat": centroid_lat,
                "centroid_lon": centroid_lon,
            }
        )

    risk_flags = [c["id"] for c in clusters_with_centroids if c["risk_flag"]]

    return {
        "cluster_count": cluster_count,
        "cluster_sizes": cluster_sizes,
        "cluster_labels": labels.tolist(),
        "risk_flags": risk_flags,
        "point_count": len(points),
        "clusters": clusters_with_centroids,
    }
