# api/crowd_routes.py
# Endpoints only: fetch crowd locations and trigger surge.

from fastapi import APIRouter, Query

from config import settings
from simulation import density_controller
from density import run_dbscan
from storage import memory_store

router = APIRouter(prefix="/crowd", tags=["crowd"])


@router.get("/locations")
def get_crowd_locations(
    alert_threshold: int = Query(None),
    min_cluster: int = Query(None),
    eps: float = Query(None),
):
    """Return current simulated crowd points (lat, lng) with live clustering parameters.
    
    Query Parameters:
    - alert_threshold: Risk threshold for cluster size (default: 80)
    - min_cluster: Minimum samples for DBSCAN clustering (default: 15)
    - eps: DBSCAN eps in kilometers (default: 0.025 km = 25m)
    """
    locations = memory_store.get_locations()
    points = [{"lat": loc.latitude, "lon": loc.longitude} for loc in locations]

    # Fallback to settings defaults if parameters not provided
    eps_km = eps if eps is not None else settings.DBSCAN_EPS_METERS / 1000
    min_samples = min_cluster if min_cluster is not None else settings.DBSCAN_MIN_SAMPLES
    alert_thresh = alert_threshold if alert_threshold is not None else settings.CLUSTER_ALERT_THRESHOLD
    
    # Convert km back to meters for run_dbscan
    eps_meters = eps_km * 1000

    # Compute clusters on the fly for the response
    db_result = run_dbscan(
        points,
        eps_meters=eps_meters,
        min_samples=min_samples,
        alert_threshold=alert_thresh,
    )
    clusters = [
        {
            "cluster_id": c["id"],
            "cluster_size": c["size"],
            "centroid": {"lat": c["centroid_lat"], "lon": c["centroid_lon"]},
            "risk_flag": c["risk_flag"],
        }
        for c in db_result.get("clusters", [])
    ]

    return {
        "count": len(locations),
        "points": points,
        "clusters": clusters,
    }


@router.post("/surge")
def trigger_surge(extra: int = settings.SURGE_EXTRA):
    """Trigger a crowd surge or reset it.

    If `extra` is positive we add that many attendees to the simulated
    base count.  When `extra` is zero we clear any previously applied surge
    so the crowd returns to normal size.
    """
    if extra <= 0:
        # Treat zero or negative as "clear surge" command
        density_controller.clear_surge()
        return {"ok": True, "message": "Surge cleared, crowd back to normal"}

    density_controller.trigger_surge(extra)
    return {"ok": True, "message": f"Surge triggered: +{extra} attendees"}
