import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity } from 'lucide-react';
import Button from './Button';
import { auth } from '../../firebase/config';
import { logout } from '../../services/authService';

const HomeNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleToggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const isLoggedIn = !!auth.currentUser;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        isScrolled ? 'bg-[#000000]/90 backdrop-blur-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Activity size={32} className="text-[#1DCD9F] mr-2" />
            <span className="text-white font-bold text-2xl">TaskBoard Pro</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-white hover:text-[#1DCD9F] transition font-medium">Home</Link>
            <Link to="/features" className="text-white hover:text-[#1DCD9F] transition font-medium">Features</Link>
            <Link to="/pricing" className="text-white hover:text-[#1DCD9F] transition font-medium">Pricing</Link>
            <Link to="/about" className="text-white hover:text-[#1DCD9F] transition font-medium">About</Link>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button variant="primary" size="md">Dashboard</Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  size="md"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="md">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="md">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="text" 
              onClick={handleToggleMenu}
              className="text-white p-1"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-[#111111] border-t border-[#333333]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white hover:text-[#1DCD9F] transition px-2 py-3 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/features" 
                className="text-white hover:text-[#1DCD9F] transition px-2 py-3 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className="text-white hover:text-[#1DCD9F] transition px-2 py-3 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-[#1DCD9F] transition px-2 py-3 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-4"
                  >
                    <Button variant="primary" size="md" className="w-full">Dashboard</Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }} 
                    size="md"
                    className="w-full"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-4"
                  >
                    <Button variant="outline" size="md" className="w-full">Login</Button>
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="primary" size="md" className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default HomeNavbar;
