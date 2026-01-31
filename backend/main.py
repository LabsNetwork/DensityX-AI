# backend/main.py
# Application entry point: wire API, config, and continuous crowd simulation.

import time
import uvicorn
from fastapi import FastAPI

from api.crowd_routes import router as crowd_router
from api.location_routes import router as location_router
from config import settings
from ai_engine import run_dbscan
from simulation import crowd_generator, density_controller, scheduler
from storage import memory_store

# Set base crowd size from config (dynamic at runtime)
density_controller.set_base_count(settings.BASE_CROWD_SIZE)


def tick() -> None:
    """One simulation step: generate current target count of points and store them."""
    target = density_controller.get_target_count()
    points = crowd_generator.generate_locations(
        settings.VENUE_CENTER_LAT,
        settings.VENUE_CENTER_LNG,
        settings.DELTA_LAT,
        settings.DELTA_LNG,
        target,
    )
    memory_store.set_locations(points)
    # Same list (including hotspot points) into ingestion buffer for DBSCAN
    ts = int(time.time())
    payloads = [
        {"user_id": f"sim-{i}", "lat": p.latitude, "lng": p.longitude, "timestamp": ts}
        for i, p in enumerate(points)
    ]
    memory_store.ingest_locations(payloads)
    print(f"[simulation] generated {len(points)} points (target={target})")


def density_tick() -> None:
    """Run DBSCAN on last 60s of ingested locations; store result and print to console."""
    points = memory_store.get_ingested_locations_last_60s()
    print(f"[density-debug] points_count={len(points)} sample={points[:5]}")

    result = run_dbscan(
        points,
        eps=settings.DBSCAN_EPS,
        min_samples=settings.DBSCAN_MIN_SAMPLES,
        high_risk_min_size=settings.HIGH_RISK_MIN_SIZE,
    )
    memory_store.set_last_density_result(result)
    print(
        f"[density] clusters={result['cluster_count']} "
        f"sizes={result['cluster_sizes']} "
        f"risk_flags={result['risk_flags']}"
    )


app = FastAPI(title="DensityX AI", description="Crowd location simulation")

# ✅ ONLY include routers that actually exist
app.include_router(crowd_router, prefix="/crowd", tags=["Crowd"])
app.include_router(location_router, prefix="/location", tags=["Location"])



@app.on_event("startup")
def startup() -> None:
    """Start continuous crowd generation and density detection in background threads."""
    scheduler.start_scheduler(settings.UPDATE_INTERVAL_SECONDS, tick)
    scheduler.start_scheduler(settings.DBSCAN_INTERVAL_SECONDS, density_tick)
    print(f"[startup] scheduler every {settings.UPDATE_INTERVAL_SECONDS}s")
    print(f"[startup] DBSCAN every {settings.DBSCAN_INTERVAL_SECONDS}s")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
