# config/settings.py
# Venue and simulation settings for crowd generation (in-memory only).

# ========== MODE SELECTION ==========
# Set to True for simulation (generates mock crowd data)
# Set to False for real mode (uses actual user GPS registrations)
USE_SIMULATION = False  # ✅ REAL MODE: Uses actual registered user GPS data

# Venue center (latitude, longitude) — fake but realistic for a bounded area
VENUE_CENTER_LAT = 37.7749
VENUE_CENTER_LNG = -122.4194

# Bounding box: half-extents from center (degrees). Points generated in
# [center - delta, center + delta] for both lat and lng.
DELTA_LAT = 0.001
DELTA_LNG = 0.001

# Base number of simulated attendees (dynamic; can change at runtime)
BASE_CROWD_SIZE = 200

# How often to regenerate crowd positions (seconds)
UPDATE_INTERVAL_SECONDS = 2

# Extra attendees to add when a surge is triggered
SURGE_EXTRA = 150

# ========== DBSCAN CLUSTERING ==========
# DBSCAN clustering parameters for crowd density detection
DBSCAN_EPS_METERS = 25  # Maximum distance between points in a cluster (25 meters)
DBSCAN_MIN_SAMPLES = 15  # Minimum points to form a cluster
DBSCAN_INTERVAL_SECONDS = 3  # How often to run DBSCAN clustering
CLUSTER_ALERT_THRESHOLD = 25  # Alert if cluster size exceeds this

# ========== TRACKING ==========
# How many km radius around venue for simulation bounding box
VENUE_RADIUS_KM = 1  # 1 km radius venue

# Margin around bounding box in meters
AREA_MARGIN_METERS = 100
