# config/settings.py
# Configuration for crowd monitoring system (simulation or real ticket-based).

# ============= MODE SELECTION =============
# Set to True for simulated crowd, False for real ticket-verified users
USE_SIMULATION = True

# ============= TICKET VERIFICATION =============
# Path to CSV file containing valid ticket IDs
TICKETS_CSV_PATH = "tickets.csv"

# ============= VENUE CONFIGURATION =============
# Venue center (latitude, longitude) — anchored in Anna Nagar, Chennai
VENUE_CENTER_LAT = 13.0850
VENUE_CENTER_LNG = 80.2101

# Simulation area control via radius (in kilometers)
# The radius defines how far (in km) the simulated points can scatter from
# the venue center in all directions.  This is converted to latitude/longitude
# degrees dynamically using the venue center's latitude.
# Increase this to expand the venue footprint across a larger area without
# changing the number of points or cluster density.
# Examples:
#   1.5 km = ~1.5 km radius (tight, original Anna Nagar box)
#   3.0 km = ~3.0 km radius (medium-large venue)
#   5.0 km = ~5.0 km radius (large, multi-district festival)
VENUE_RADIUS_KM = 4.0

# Additional area margin (meters) to extend the bounding box on all sides.
# This is applied *after* the radius is converted to degrees.  It provides
# extra breathing room so points don't cluster exactly at the edges.
AREA_MARGIN_METERS = 200  # converted to degrees based on venue latitude

# Legacy settings (no longer used; kept for reference)
STADIUM_RADIUS_METERS = 0  # deprecated
VENUE_SPREAD_RADIUS = 0.015  # deprecated; use VENUE_RADIUS_KM instead
DELTA_LAT = 0.010   # deprecated
DELTA_LNG = 0.015   # deprecated

# ============= SIMULATION MODE (when USE_SIMULATION=True) =============
# Base number of simulated attendees (dynamic; can change at runtime)
BASE_CROWD_SIZE = 200

# How often to regenerate crowd positions (seconds)
UPDATE_INTERVAL_SECONDS = 2

# Extra attendees to add when a surge is triggered
SURGE_EXTRA = 150

# --- Hotspot (cluster) simulation ---
# Fraction of points generated tightly around a single hotspot (~30%)
HOTSPOT_FRACTION = 0.3
# Max random offset from hotspot (degrees); much smaller than venue delta so DBSCAN can cluster
HOTSPOT_DELTA = 0.00003

# ============= DENSITY DETECTION (DBSCAN) =============
# How often to run DBSCAN on current locations (seconds) - ALWAYS RUNS regardless of mode
DBSCAN_INTERVAL_SECONDS = 10
# Max distance between points in meters for clustering (venue-scale).
# Lowering eps reduces over‑clustering in a sparser, large-area venue.
DBSCAN_EPS_METERS = 25
# Minimum number of neighbours required to form a cluster; raising this
# helps ignore tiny groups of people when the venue is large.
DBSCAN_MIN_SAMPLES = 15
# Cluster size >= this is flagged as high-risk (not currently used by
# run_dbscan but available for future extensions).
HIGH_RISK_MIN_SIZE = 10
# Proactive alert: cluster size above this triggers UI alert and red zone.
# Alerts only trigger when a cluster size >= this threshold.
CLUSTER_ALERT_THRESHOLD = 80

