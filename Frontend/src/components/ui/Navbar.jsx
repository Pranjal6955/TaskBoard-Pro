import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity, CircleUser } from 'lucide-react';
import Button from './Button';
import { user } from '../../assets/mockData';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
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
  
  const isLoggedIn = location.pathname !== '/' && location.pathname !== '/login';
  
  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        isScrolled || isLoggedIn ? 'bg-[#000000]/95 backdrop-blur-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Activity size={28} className="text-[#1DCD9F] mr-2" />
            <span className="text-white font-bold text-xl">TaskBoard Pro</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-white/80 hover:text-white transition">Dashboard</Link>
                <div className="flex items-center space-x-3">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full border-2 border-[#1DCD9F]" 
                  />
                  <span className="text-white">{user.name}</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/" className="text-white/80 hover:text-white transition">Home</Link>
                <Link to="/features" className="text-white/80 hover:text-white transition">Features</Link>
                <Link to="/login">
                  <Button variant="primary" size="sm">Login</Button>
                </Link>
              </>
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
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-3 px-2 py-3">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full border-2 border-[#1DCD9F]" 
                    />
                    <span className="text-white">{user.name}</span>
                  </div>
                  <Link 
                    to="/dashboard" 
                    className="text-white/80 hover:text-white transition px-2 py-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    className="text-white/80 hover:text-white transition px-2 py-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/features" 
                    className="text-white/80 hover:text-white transition px-2 py-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  {/* <Link 
                    to="/pricing" 
                    className="text-white/80 hover:text-white transition px-2 py-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link> */}
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="primary" size="sm" className="w-full">Login</Button>
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

export default Navbar;