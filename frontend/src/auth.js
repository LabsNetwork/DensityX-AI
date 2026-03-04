import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getFirebaseAuth } from './firebase';

let currentUser = null;

export const subscribeToAuthChanges = (callback) => {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, (user) => {
    currentUser = user;
    callback(user);
  });
};

export const registerWithEmail = async (email, password) => {
  const auth = getFirebaseAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginWithEmail = async (email, password) => {
  const auth = getFirebaseAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginWithGoogle = async () => {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  const auth = getFirebaseAuth();
  try {
    await signOut(auth);
    currentUser = null;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return currentUser;
};

export const getIdToken = async () => {
  const auth = getFirebaseAuth();
  if (!auth.currentUser) return null;
  
  try {
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};
