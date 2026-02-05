# simulation/crowd_generator.py
# Pure logic: generate (lat, lng) points inside a bounding box. No API calls.

import random
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
    Generate crowd points focused on Anna Nagar, Chennai:
    - 2–4 hotspots inside the bounding box (dense clusters, 70–80% of points).
    - Remaining points lightly scattered across the box.
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

    # Lightly scattered points across the bounding box
    for _ in range(scatter_points):
        lat = center_lat + random.uniform(-delta_lat, delta_lat)
        lng = center_lng + random.uniform(-delta_lng, delta_lng)
        locations.append(Location(latitude=lat, longitude=lng))

    return locations
