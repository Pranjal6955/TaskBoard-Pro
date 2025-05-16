import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  getAuth
} from 'firebase/auth';
import { auth } from '../firebase/config';
import api from './api';

/**
 * Handle Google authentication
 */
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

/**
 * Get the JWT token from Firebase auth
 */
export const getToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return null;
  }
  
  try {
    return await currentUser.getIdToken(true);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Register user with backend
 */
export const registerWithBackend = async (user) => {
  if (!user) return null;
  
  try {
    // Get fresh token
    const token = await user.getIdToken(true);
    
    // Make request with token in headers
    const response = await api.post('/auth/token', {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error registering with backend:', error);
    throw error;
  }
};

/**
 * Logout the user
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const checkAuthState = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Get current authentication token
 */
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Verify backend connection and authentication
 */
export const verifyBackendAuth = async () => {
  try {
    const response = await api.get('/auth/test');
    return response.data;
  } catch (error) {
    console.error('Backend auth verification failed:', error);
    throw error;
  }
};
