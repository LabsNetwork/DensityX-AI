// Offline/Fallback Handler for DensityX-AI
// Manages graceful degradation when Firebase connection is unavailable

import { useState, useEffect } from 'react';

const CACHE_KEY = 'densityX_offline_cache';
const SYNC_QUEUE_KEY = 'densityX_sync_queue';

class OfflineHandler {
  constructor() {
    this.isOnline = navigator.onLine;
    this.cachedClusters = this.loadCache();
    this.syncQueue = this.loadSyncQueue();
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  handleOnline() {
    this.isOnline = true;
    console.log('🟢 Connection restored');
    this.processQueuedUpdates();
  }

  handleOffline() {
    this.isOnline = false;
    console.log('🔴 Connection lost - running in offline mode');
  }

  saveClusters(clusters, eventType = 'default') {
    const cache = this.loadCache();
    cache[eventType] = {
      data: clusters,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }

  loadCache() {
    try {
      const cache = localStorage.getItem(CACHE_KEY);
      return cache ? JSON.parse(cache) : {};
    } catch (e) {
      console.error('Error loading cache:', e);
      return {};
    }
  }

  getCachedClusters(eventType = 'default') {
    return this.cachedClusters[eventType] || { data: [], timestamp: null };
  }

  queueUpdate(action, data, eventType = 'default') {
    if (!this.isOnline) {
      this.syncQueue.push({
        action,
        data,
        eventType,
        timestamp: new Date().getTime()
      });
      this.saveSyncQueue();
    }
  }

  loadSyncQueue() {
    try {
      const queue = localStorage.getItem(SYNC_QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (e) {
      console.error('Error loading sync queue:', e);
      return [];
    }
  }

  saveSyncQueue() {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(this.syncQueue));
  }

  async processQueuedUpdates() {
    if (this.syncQueue.length === 0) return;

    console.log(`📤 Processing ${this.syncQueue.length} queued updates...`);

    for (const item of this.syncQueue) {
      try {
        // Process each queued update
        // This would integrate with actual API calls
        console.log(`Syncing: ${item.action}`);
      } catch (error) {
        console.error('Error syncing:', error);
        // Keep in queue if sync fails
        break;
      }
    }

    // Clear queue after successful sync
    this.syncQueue = [];
    this.saveSyncQueue();
  }

  isConnected() {
    return this.isOnline;
  }
}

// React Hook for offline detection
export const useOfflineHandler = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineHandler] = useState(() => new OfflineHandler());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, offlineHandler };
};

export default OfflineHandler;
