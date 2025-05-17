import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/config';
import { registerUserAfterGoogleLogin } from './services/userService';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import AutomationPage from './pages/AutomationPage';
import HomePage from './pages/HomePage';

// AuthRoute component to protect routes that require authentication
const AuthRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setAuthChecked(true);
      
      // If user exists and logs in, ensure their data is in MongoDB
      if (user) {
        registerUserAfterGoogleLogin(user)
          .catch(error => console.error('Error updating user data:', error));
      }
    });

    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return <div className="flex justify-center items-center h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1DCD9F]"></div>
    </div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <AuthRoute>
              <DashboardPage />
            </AuthRoute>
          } />
          <Route path="/projects/:id" element={
            <AuthRoute>
              <ProjectPage />
            </AuthRoute>
          } />
          <Route path="/projects/:id/automation" element={
            <AuthRoute>
              <AutomationPage />
            </AuthRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
