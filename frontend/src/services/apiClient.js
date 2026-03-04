// API client for DensityX backend
const API_BASE = "https://densityx-ai.onrender.com";

export const apiClient = {
  // Fetch crowd locations and clusters
  async getCrowdData() {
    try {
      const response = await fetch(`${API_BASE}/crowd/locations`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch crowd data:", error);
      throw error;
    }
  },

  // Fetch density analysis
  async getDensityData() {
    try {
      const response = await fetch(`${API_BASE}/density`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch density data:", error);
      throw error;
    }
  },

  // Get health status
  async getHealth() {
    try {
      const response = await fetch(`${API_BASE}/health`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  },

  // Get active users count
  async getActiveUsersCount() {
    try {
      const response = await fetch(`${API_BASE}/user/active-count`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to get active users count:", error);
      throw error;
    }
  },

  // Register a user
  async registerUser(ticketId, name, phone) {
    try {
      const response = await fetch(`${API_BASE}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId, name, phone }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to register user:", error);
      throw error;
    }
  },

  // Update user location
  async updateLocation(ticketId, latitude, longitude, gpsEnabled = true) {
    try {
      const response = await fetch(`${API_BASE}/user/location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId, latitude, longitude, gps_enabled: gpsEnabled }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to update location:", error);
      throw error;
    }
  },
};
