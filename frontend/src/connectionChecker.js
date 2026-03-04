// Firebase Connection Checker
// Verifies Firebase connectivity and provides diagnostic information

export const checkFirebaseConnection = async (database) => {
  const startTime = performance.now();
  
  try {
    // Test write access
    const testRef = ref(database, '.info/connected');
    const snapshot = await get(testRef);
    
    const endTime = performance.now();
    const latency = endTime - startTime;

    return {
      connected: snapshot.val() === true,
      latency: Math.round(latency),
      timestamp: new Date().toISOString(),
      status: 'success'
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      status: 'error'
    };
  }
};

export const verifyClusterAccess = async (database) => {
  try {
    const clustersRef = ref(database, 'clusters');
    const snapshot = await get(clustersRef);
    
    return {
      accessible: true,
      hasData: snapshot.exists(),
      dataSize: snapshot.size || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      accessible: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

export const getDiagnostics = async (database) => {
  const [connectionStatus, clusterStatus] = await Promise.all([
    checkFirebaseConnection(database),
    verifyClusterAccess(database)
  ]);

  return {
    firebaseConnection: connectionStatus,
    clusterAccess: clusterStatus,
    diagnosticsTimestamp: new Date().toISOString(),
    isHealthy: connectionStatus.connected && clusterStatus.accessible
  };
};
