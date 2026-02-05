# api/crowd_routes.py
# Endpoints only: fetch crowd locations and trigger surge.

from fastapi import APIRouter

from config import settings
from simulation import density_controller
from density import run_dbscan
from storage import memory_store

router = APIRouter(prefix="/crowd", tags=["crowd"])


@router.get("/locations")
def get_crowd_locations():
    """Return current simulated crowd points (lat, lng)."""
    locations = memory_store.get_locations()
    points = [{"lat": loc.latitude, "lon": loc.longitude} for loc in locations]

    # Compute clusters on the fly for the response
    db_result = run_dbscan(
        points,
        eps_meters=settings.DBSCAN_EPS_METERS,
        min_samples=settings.DBSCAN_MIN_SAMPLES,
        alert_threshold=settings.CLUSTER_ALERT_THRESHOLD,
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
    """Trigger a crowd surge: add `extra` to the target attendee count."""
    density_controller.trigger_surge(extra)
    return {"ok": True, "message": f"Surge triggered: +{extra} attendees"}
