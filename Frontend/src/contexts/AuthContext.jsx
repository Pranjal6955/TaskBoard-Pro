import React, { createContext, useContext, useState, useEffect } from 'react';
// Placeholder for firebase auth
// import { auth } from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock sign in function (will be replaced with Firebase)
  const signIn = async (email, password) => {
    // Simulating authentication success
    setCurrentUser({
      id: 'user123',
      email,
      name: 'Test User',
      avatar: 'TU',
    });
    return true;
  };

  // Mock sign up function (will be replaced with Firebase)
  const signUp = async (name, email, password) => {
    // Simulating user creation success
    setCurrentUser({
      id: 'user123',
      email,
      name,
      avatar: name.split(' ').map(n => n[0]).join(''),
    });
    return true;
  };

  // Sign out function
  const signOut = async () => {
    // Clear user data
    setCurrentUser(null);
    return true;
  };

  // Check if user is authenticated
  useEffect(() => {
    // Simulating auth state check
    const checkAuth = async () => {
      // For now, we'll just set loading to false
      // Later, this will use Firebase's onAuthStateChanged
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    checkAuth();
  }, []);

  const value = {
    currentUser,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
