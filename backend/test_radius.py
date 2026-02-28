#!/usr/bin/env python3
"""Quick test of venue radius conversion."""
import sys
import math
from config import settings
from simulation.crowd_generator import generate_locations

print('=== Venue Radius Configuration Test ===')
print(f'VENUE_RADIUS_KM: {settings.VENUE_RADIUS_KM}')
print(f'AREA_MARGIN_METERS: {settings.AREA_MARGIN_METERS}')

# Convert km to degrees
meters_per_deg_lat = 111_320
meters_per_deg_lng = 111_320 * abs(math.cos(math.radians(settings.VENUE_CENTER_LAT)))
radius_meters = settings.VENUE_RADIUS_KM * 1000
delta_lat = radius_meters / meters_per_deg_lat
delta_lng = radius_meters / meters_per_deg_lng

print(f'\nConverted: {settings.VENUE_RADIUS_KM} km => {delta_lat:.5f}° lat, {delta_lng:.5f}° lng')

# Generate 200 test points
pts = generate_locations(
    settings.VENUE_CENTER_LAT,
    settings.VENUE_CENTER_LNG,
    delta_lat,
    delta_lng,
    200
)

lats = [p.latitude for p in pts]
lngs = [p.longitude for p in pts]

print(f'\nGenerated {len(pts)} points')
print(f'Lat range: {min(lats):.5f} to {max(lats):.5f}')
print(f'Lng range: {min(lngs):.5f} to {max(lngs):.5f}')

# Convert back to km for readability
lat_span_deg = max(lats) - min(lats)
lng_span_deg = max(lngs) - min(lngs)
lat_span_km = lat_span_deg * 111.32
lng_span_km = lng_span_deg * 111.32 * math.cos(math.radians(settings.VENUE_CENTER_LAT))

print(f'\nGeographic coverage:')
print(f'  Latitude span: {lat_span_km:.2f} km')
print(f'  Longitude span: {lng_span_km:.2f} km')
print(f'  Diagonal: {math.sqrt(lat_span_km**2 + lng_span_km**2):.2f} km')
