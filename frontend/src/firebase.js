import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let firebaseApp;
let database;
let auth;
let isInitialized = false;

export const initializeFirebase = async () => {
  if (isInitialized) return { app: firebaseApp, database, auth };
  
  try {
    firebaseApp = initializeApp(firebaseConfig);
    database = getDatabase(firebaseApp);
    auth = getAuth(firebaseApp);
    
    // Enable development emulator if in development mode
    if (import.meta.env.DEV && window.location.hostname === 'localhost') {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      } catch (e) {
        // Emulator might not be running, that's fine
      }
    }
    
    isInitialized = true;
    console.log('Firebase initialized successfully');
    return { app: firebaseApp, database, auth };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

export const getFirebaseDatabase = () => {
  if (!isInitialized) {
    throw new Error('Firebase not initialized. Call initializeFirebase first.');
  }
  return database;
};

export const getFirebaseAuth = () => {
  if (!isInitialized) {
    throw new Error('Firebase not initialized. Call initializeFirebase first.');
  }
  return auth;
};

export const listenToClusters = (eventType = 'default', callback) => {
  const db = getFirebaseDatabase();
  const clustersRef = ref(db, `clusters/${eventType}`);
  
  const unsubscribe = onValue(clustersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data.data || [], data.timestamp || null);
    }
  }, (error) => {
    console.error('Error listening to clusters:', error);
    callback([], null);
  });
  
  return unsubscribe;
};

export const writeClusters = async (clusters, eventType = 'default') => {
  const db = getFirebaseDatabase();
  const clustersRef = ref(db, `clusters/${eventType}`);
  
  try {
    await set(clustersRef, {
      data: clusters,
      timestamp: new Date().getTime(),
      verified_only: true
    });
  } catch (error) {
    console.error('Error writing clusters:', error);
    throw error;
  }
};

export const readClusters = async (eventType = 'default') => {
  const db = getFirebaseDatabase();
  const clustersRef = ref(db, `clusters/${eventType}`);
  
  try {
    const snapshot = await get(clustersRef);
    return snapshot.val() || { data: [], timestamp: null };
  } catch (error) {
    console.error('Error reading clusters:', error);
    return { data: [], timestamp: null };
  }
};
