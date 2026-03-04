"""
🎤 Event-Aware Cluster Reshaper
Handles dynamic cluster formation, merging, splitting, and adaptive density thresholds.

Key features:
- Single-user clusters: Even 1 verified user creates a cluster
- Dynamic reshaping: Clusters expand/shrink/merge/split in real-time
- Event-aware thresholds: Surge alerts based on event capacity and current density
- Verified-only: Only clusters from verified ticket holders
"""

from typing import Any, Dict, List, Optional, Tuple
import math


class ClusterReshaper:
    """
    Manages dynamic cluster formation and adaptive surge detection.
    
    Cluster behavior:
    - 1 verified user → 1 cluster (single-person cluster)
    - Users joining → clusters expand dynamically
    - Movement → clusters reshape (expand, shrink, merge, split)
    - Surge detection → adaptive thresholds based on event context
    """
    
    def __init__(self):
        """Initialize the reshaper (stateless)."""
        pass
    
    @staticmethod
    def calculate_adaptive_surge_threshold(
        total_verified_attendees: int,
        event_capacity: Optional[int] = None,
        spatial_spread_km: float = 4.0,
    ) -> int:
        """
        Calculate dynamic surge threshold based on event context.
        
        Logic:
        - Small events (50 people): Threshold = 30% of attendees
        - Medium events (500 people): Threshold = 25% of attendees
        - Large events (5000+ people): Threshold = 20% of attendees
        - Stadium events (50000+): Threshold = 15% of attendees
        
        Spatial distribution adjustment:
        - Tight venue (1 km): Lower threshold (clusters closer together)
        - Medium venue (3-4 km): Normal threshold
        - Large venue (5+ km): Higher threshold (naturally more spread)
        
        Args:
            total_verified_attendees: Total verified users in event
            event_capacity: Expected event capacity (optional)
            spatial_spread_km: Venue radius in kilometers
            
        Returns:
            Dynamic alert threshold (minimum cluster size for alert)
        """
        
        # Base threshold calculation by event size
        if total_verified_attendees < 100:
            # Small gathering: 30% of attendees triggers alert
            base_threshold = max(5, int(total_verified_attendees * 0.30))
        elif total_verified_attendees < 1000:
            # Medium event: 25% of attendees
            base_threshold = max(10, int(total_verified_attendees * 0.25))
        elif total_verified_attendees < 10000:
            # Large event: 20% of attendees
            base_threshold = max(25, int(total_verified_attendees * 0.20))
        else:
            # Stadium/massive event: 15% of attendees
            base_threshold = max(100, int(total_verified_attendees * 0.15))
        
        # Spatial adjustment: tight venues → lower threshold
        if spatial_spread_km <= 1.0:
            # Very tight venue: reduce threshold by 20%
            spatial_factor = 0.80
        elif spatial_spread_km <= 2.0:
            # Tight venue: reduce threshold by 10%
            spatial_factor = 0.90
        elif spatial_spread_km <= 5.0:
            # Normal venue: no adjustment
            spatial_factor = 1.0
        else:
            # Large sprawling venue: increase threshold by 10%
            spatial_factor = 1.10
        
        # Capacity-based adjustment (if provided)
        capacity_factor = 1.0
        if event_capacity and event_capacity > 0:
            occupancy = total_verified_attendees / event_capacity
            if occupancy > 0.80:
                # Over 80% capacity: lower threshold by 15%
                capacity_factor = 0.85
            elif occupancy > 0.60:
                # Over 60% capacity: lower threshold by 10%
                capacity_factor = 0.90
        
        adaptive_threshold = max(
            3,  # Minimum: even small clusters of 3+ trigger alert in tight venues
            int(base_threshold * spatial_factor * capacity_factor)
        )
        
        return adaptive_threshold
    
    @staticmethod
    def should_single_user_create_cluster(verified_user_count: int) -> bool:
        """
        Determine if single verified users should create visible clusters.
        
        Rule:
        - Event < 100 people: Show single-user clusters (visible safety monitoring)
        - Event >= 100 people: Only cluster if min_samples allows
        
        Args:
            verified_user_count: Total verified attendees
            
        Returns:
            True if single users should create clusters
        """
        return verified_user_count < 100
    
    @staticmethod
    def calculate_cluster_visual_size(
        cluster_size: int,
        total_verified: int,
        base_radius_meters: float = 25.0,
    ) -> float:
        """
        Calculate visual radius for a cluster based on relative density.
        
        Prevents stacking: larger clusters appear larger on map.
        Ensures readability: minimum and maximum sizes enforced.
        
        Args:
            cluster_size: Number of people in cluster
            total_verified: Total verified attendees
            base_radius_meters: Base cluster radius (DBSCAN eps)
            
        Returns:
            Visual radius in meters for rendering
        """
        
        # Calculate relative density (0.0 to 1.0)
        relative_density = min(1.0, cluster_size / max(10, total_verified))
        
        # Visual size grows logarithmically with cluster size
        # Prevents huge circles for large clusters
        size_multiplier = 1.0 + (math.log(max(1, cluster_size)) / math.log(max(2, total_verified))) * 2
        
        # Apply bounds: min 15m, max 200m
        visual_radius = base_radius_meters * size_multiplier
        return min(200.0, max(15.0, visual_radius))
    
    @staticmethod
    def determine_cluster_risk_level(
        cluster_size: int,
        adaptive_threshold: int,
        total_verified: int,
    ) -> str:
        """
        Determine risk level for cluster visualization/alerting.
        
        Levels:
        - 'safe': Below 50% of threshold
        - 'caution': 50-99% of threshold
        - 'alert': 100-150% of threshold
        - 'critical': 150%+ of threshold
        
        Args:
            cluster_size: Number of people in cluster
            adaptive_threshold: Dynamic alert threshold
            total_verified: Total verified attendees
            
        Returns:
            Risk level string for UI rendering
        """
        
        percentage = (cluster_size / adaptive_threshold) * 100 if adaptive_threshold > 0 else 0
        
        if percentage >= 150:
            return 'critical'
        elif percentage >= 100:
            return 'alert'
        elif percentage >= 50:
            return 'caution'
        else:
            return 'safe'
    
    @staticmethod
    def get_cluster_color(risk_level: str) -> str:
        """Get color for risk level visualization."""
        colors = {
            'safe': '#00AA00',      # Green
            'caution': '#FFAA00',   # Orange
            'alert': '#FF5500',     # Red-orange
            'critical': '#FF0000',  # Red
        }
        return colors.get(risk_level, '#00AA00')
    
    @staticmethod
    def calculate_cluster_stability(
        cluster_size: int,
        cluster_age_seconds: int = 30,
    ) -> float:
        """
        Calculate cluster stability (0.0 to 1.0).
        More stable = less likely to split/merge soon.
        
        Used for smooth visual transitions.
        
        Args:
            cluster_size: Number of people in cluster
            cluster_age_seconds: How long cluster has existed
            
        Returns:
            Stability score (0.0 = newly formed, 1.0 = very stable)
        """
        
        # Stability increases with size and age
        size_stability = min(1.0, cluster_size / 50.0)  # Stable at 50+ people
        age_stability = min(1.0, cluster_age_seconds / 120.0)  # Stable after 2 minutes
        
        return (size_stability + age_stability) / 2.0
    
    @staticmethod
    def should_trigger_alert(
        cluster_size: int,
        adaptive_threshold: int,
        risk_level: str,
    ) -> bool:
        """
        Determine if cluster should trigger a surge alert.
        
        Args:
            cluster_size: Number of people in cluster
            adaptive_threshold: Dynamic alert threshold
            risk_level: Current risk level ('safe', 'caution', 'alert', 'critical')
            
        Returns:
            True if alert should trigger
        """
        return risk_level in ('alert', 'critical') and cluster_size >= adaptive_threshold


def reshape_clusters_for_event(
    db_result: Dict[str, Any],
    total_verified_attendees: int,
    event_capacity: Optional[int] = None,
    spatial_spread_km: float = 4.0,
) -> Dict[str, Any]:
    """
    Reshape clustering results for event-aware visualization and alerting.
    
    Transforms raw DBSCAN output into event-aware clusters with:
    - Dynamic surge thresholds
    - Risk levels
    - Visual properties
    - Stability metrics
    
    Args:
        db_result: Raw DBSCAN clustering result
        total_verified_attendees: Count of verified users with GPS
        event_capacity: Optional expected event capacity
        spatial_spread_km: Venue radius in kilometers
        
    Returns:
        Enhanced clustering result with event context
    """
    
    reshaper = ClusterReshaper()
    
    # Calculate adaptive threshold
    adaptive_threshold = reshaper.calculate_adaptive_surge_threshold(
        total_verified_attendees,
        event_capacity,
        spatial_spread_km,
    )
    
    # Reshape clusters with risk levels and visual properties
    reshaped_clusters = []
    alert_clusters = []
    
    for cluster in db_result.get('clusters', []):
        cluster_size = cluster.get('size', 1)
        
        # Calculate risk level
        risk_level = reshaper.determine_cluster_risk_level(
            cluster_size,
            adaptive_threshold,
            total_verified_attendees,
        )
        
        # Calculate visual properties
        visual_radius = reshaper.calculate_cluster_visual_size(
            cluster_size,
            total_verified_attendees,
        )
        
        stability = reshaper.calculate_cluster_stability(cluster_size)
        
        # Determine if alert should trigger
        should_alert = reshaper.should_trigger_alert(
            cluster_size,
            adaptive_threshold,
            risk_level,
        )
        
        # Build enriched cluster object
        reshaped = {
            'id': cluster.get('id'),
            'size': cluster_size,
            'centroid_lat': cluster.get('centroid_lat'),
            'centroid_lon': cluster.get('centroid_lon'),
            'risk_level': risk_level,
            'risk_flag': should_alert,  # For backward compatibility
            'color': reshaper.get_cluster_color(risk_level),
            'visual_radius_meters': visual_radius,
            'stability': stability,
            'threshold': adaptive_threshold,
        }
        
        reshaped_clusters.append(reshaped)
        
        if should_alert:
            alert_clusters.append(reshaped)
    
    return {
        'cluster_count': len(reshaped_clusters),
        'cluster_sizes': [c['size'] for c in reshaped_clusters],
        'clusters': reshaped_clusters,
        'adaptive_threshold': adaptive_threshold,
        'alert_clusters': alert_clusters,
        'alert_count': len(alert_clusters),
        'verified_attendees': total_verified_attendees,
        'event_capacity': event_capacity,
        'spatial_spread_km': spatial_spread_km,
    }
