# simulation/crowd_generator.py
# Pure logic: generate (lat, lng) points inside a bounding box. No API calls.

import random
import math
from typing import List

from config import settings
from models.location import Location


def generate_locations(
    center_lat: float,
    center_lng: float,
    delta_lat: float,
    delta_lng: float,
    count: int,
) -> List[Location]:
    """
    Generate crowd points within a bounding box around the given center.

    The bounding box half-extents (`delta_lat`, `delta_lng`) are derived from
    ``VENUE_RADIUS_KM`` in the settings, which is converted to degrees based
    on the venue latitude.  This allows intuitive real-world sizing (e.g.,
    "simulate a 5 km radius venue") without hardcoding geographic offsets.
    The function itself remains agnostic and simply scatters points inside
    the box plus a configurable margin.

    Behavior:
    - 2–4 hotspots inside the bounding box (dense clusters, 70–80% of points).
    - Remaining points lightly scattered across the box (with an extra margin).
    """
    locations: List[Location] = []

    # Predefined hotspot seeds around Anna Nagar (approximate anchors)
    hotspot_seeds = [
        (13.0840, 80.2105),  # Near Anna Nagar Tower Park
        (13.0875, 80.2200),  # Anna Nagar East side
        (13.0805, 80.2005),  # Kilpauk border side
        (13.0785, 80.2135),  # Toward Shenoy Nagar side
    ]

    # Pick 2–4 hotspots randomly from the seeds
    num_hotspots = random.randint(2, 4)
    hotspots = random.sample(hotspot_seeds, num_hotspots)

    total = max(1, count)
    hotspot_share = random.uniform(0.7, 0.8)  # 70–80% in hotspots
    hotspot_points = int(total * hotspot_share)
    scatter_points = total - hotspot_points

    # Distribute hotspot points roughly evenly across chosen hotspots
    points_per_hotspot = [hotspot_points // num_hotspots] * num_hotspots
    for i in range(hotspot_points % num_hotspots):
        points_per_hotspot[i] += 1

    # Small jitter so points stay tight but not overlapping
    jitter_lat = settings.HOTSPOT_DELTA
    jitter_lng = settings.HOTSPOT_DELTA

    for (h_lat, h_lng), n in zip(hotspots, points_per_hotspot):
        for _ in range(n):
            lat = h_lat + random.uniform(-jitter_lat, jitter_lat)
            lng = h_lng + random.uniform(-jitter_lng, jitter_lng)
            locations.append(Location(latitude=lat, longitude=lng))

    # Lightly scattered points across the bounding box (with margin).
    # Convert a meter margin into degree offsets using rough conversions.
    margin_m = settings.AREA_MARGIN_METERS
    meters_per_deg_lat = 111_320
    meters_per_deg_lng = 111_320 * abs(
        math.cos(math.radians(center_lat))
    )
    extra_lat = margin_m / meters_per_deg_lat
    extra_lng = margin_m / meters_per_deg_lng
    for _ in range(scatter_points):
        lat = center_lat + random.uniform(-delta_lat - extra_lat, delta_lat + extra_lat)
        lng = center_lng + random.uniform(-delta_lng - extra_lng, delta_lng + extra_lng)
        locations.append(Location(latitude=lat, longitude=lng))

    return locations
