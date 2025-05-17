import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity, LogOut, Bell, User, ChevronDown, Settings } from 'lucide-react';
import Button from './Button';
import { getCurrentUser } from '../../services/userService';
import { auth } from '../../firebase/config';
import { logout } from '../../services/authService';

const DashboardNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Mock notifications for demo purposes
  const [notifications] = useState([
    { id: 1, text: 'New task assigned to you', time: '5 min ago', isRead: false },
    { id: 2, text: 'Project deadline approaching', time: '1 hour ago', isRead: false },
    { id: 3, text: 'Weekly report available', time: '1 day ago', isRead: true },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        if (auth.currentUser) {
          const userData = await getCurrentUser();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userData = await getCurrentUser();
          setCurrentUser(userData);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setCurrentUser(null);
        navigate('/login');
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [navigate]);
  
  const handleToggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close other dropdowns when opening mobile menu
    setIsProfileDropdownOpen(false);
    setIsNotificationsOpen(false);
  };
  
  const handleToggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    // Close other dropdowns when opening profile
    setIsNotificationsOpen(false);
  };
  
  const handleToggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    // Close other dropdowns when opening notifications
    setIsProfileDropdownOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        isScrolled ? 'bg-[#111111]/95 backdrop-blur-sm shadow-lg' : 'bg-[#111111]'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <Activity size={28} className="text-[#1DCD9F] mr-2" />
              <span className="text-white font-bold text-xl">TaskBoard Pro</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-6">
              <Link to="/dashboard" className="text-white hover:text-[#1DCD9F] transition font-medium">Dashboard</Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            {/* Notifications dropdown */}
            <div className="relative">
              <button 
                onClick={handleToggleNotifications}
                className="p-2 rounded-full bg-[#222222] hover:bg-[#333333] transition relative"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-white" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-80 bg-[#1A1A1A] rounded-md shadow-lg overflow-hidden z-50 border border-[#333333]"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 py-3 border-b border-[#333333] flex justify-between items-center">
                      <h3 className="text-white font-medium">Notifications</h3>
                      <span className="text-sm text-[#1DCD9F] cursor-pointer hover:underline">Mark all as read</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto py-1">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-[#222222] transition ${!notification.isRead ? 'border-l-2 border-[#1DCD9F]' : ''}`}
                          >
                            <div className="flex items-start">
                              <div className="flex-grow">
                                <p className={`text-sm ${!notification.isRead ? 'text-white font-medium' : 'text-white/80'}`}>
                                  {notification.text}
                                </p>
                                <p className="text-xs text-white/60 mt-1">{notification.time}</p>
                              </div>
                              {!notification.isRead && (
                                <span className="h-2 w-2 rounded-full bg-[#1DCD9F]"></span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-white/60">
                          <p>No notifications yet</p>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-3 border-t border-[#333333] text-center">
                      <Link to="/dashboard/notifications" className="text-sm text-[#1DCD9F] hover:underline">
                        View all notifications
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* User profile dropdown */}
            <div className="relative">
              <button 
                onClick={handleToggleProfileDropdown}
                className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-[#222222] transition"
                aria-label="User menu"
              >
                {isLoading ? (
                  <div className="w-8 h-8 rounded-full bg-[#333333] animate-pulse"></div>
                ) : (
                  <img 
                    src={currentUser?.photoURL || 'https://i.pravatar.cc/150?img=1'} 
                    alt={currentUser?.name || 'User'} 
                    className="w-8 h-8 rounded-full border-2 border-[#1DCD9F]" 
                  />
                )}
                <div className="text-left hidden lg:block">
                  <div className="text-white font-medium flex items-center">
                    {currentUser?.name || 'User'} 
                    <ChevronDown size={16} className="ml-1" />
                  </div>
                  <div className="text-white/60 text-xs">
                    {currentUser?.email || 'user@example.com'}
                  </div>
                </div>
              </button>
              
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-64 bg-[#1A1A1A] rounded-md shadow-lg overflow-hidden z-50 border border-[#333333]"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 py-3 border-b border-[#333333]">
                      <p className="text-white font-medium">{currentUser?.name || 'User'}</p>
                      <p className="text-white/60 text-sm truncate">{currentUser?.email || 'user@example.com'}</p>
                      <div className="mt-1.5 flex items-center">
                        <span className="bg-[#1DCD9F]/20 text-[#1DCD9F] text-xs rounded-full px-2 py-0.5 mr-1.5">
                          Pro Member
                        </span>
                        <span className="bg-[#444444] text-white/80 text-xs rounded-full px-2 py-0.5">
                          5 Tasks
                        </span>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link 
                        to="/dashboard/profile" 
                        className="px-4 py-2 text-white hover:bg-[#222222] flex items-center transition"
                      >
                        <User size={16} className="mr-3" />
                        Profile
                      </Link>
                      <Link 
                        to="/dashboard/settings" 
                        className="px-4 py-2 text-white hover:bg-[#222222] flex items-center transition"
                      >
                        <Settings size={16} className="mr-3" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-red-400 hover:bg-[#222222] flex items-center transition w-full text-left"
                      >
                        <LogOut size={16} className="mr-3" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
            <div className="container mx-auto px-4 py-4 flex flex-col">
              <div className="px-2 py-3 border-b border-[#333333] mb-3">
                <div className="flex items-center">
                  {isLoading ? (
                    <div className="w-10 h-10 rounded-full bg-[#333333] animate-pulse mr-3"></div>
                  ) : (
                    <img 
                      src={currentUser?.photoURL || 'https://i.pravatar.cc/150?img=1'} 
                      alt={currentUser?.name || 'User'}
                      className="w-10 h-10 rounded-full border-2 border-[#1DCD9F] mr-3" 
                    />
                  )}
                  <div>
                    <div className="text-white font-medium">{currentUser?.name || 'User'}</div>
                    <div className="text-white/60 text-sm truncate">{currentUser?.email || 'user@example.com'}</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <span className="bg-[#1DCD9F]/20 text-[#1DCD9F] text-xs rounded-full px-2 py-0.5 mr-1.5">
                    Pro Member
                  </span>
                  <span className="bg-[#444444] text-white/80 text-xs rounded-full px-2 py-0.5">
                    5 Tasks
                  </span>
                </div>
              </div>
              
              <Link 
                to="/dashboard" 
                className="text-white hover:bg-[#222222] transition px-2 py-3 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/dashboard/tasks" 
                className="text-white hover:bg-[#222222] transition px-2 py-3 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tasks
              </Link>
              <Link 
                to="/dashboard/projects" 
                className="text-white hover:bg-[#222222] transition px-2 py-3 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <Link 
                to="/dashboard/analytics" 
                className="text-white hover:bg-[#222222] transition px-2 py-3 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analytics
              </Link>
              
              <div className="border-t border-[#333333] my-3"></div>
              
              <Link 
                to="/dashboard/notifications" 
                className="text-white hover:bg-[#222222] transition px-2 py-3 flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </Link>
              <Link 
                to="/dashboard/profile" 
                className="text-white hover:bg-[#222222] transition px-2 py-3 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={16} className="mr-3" />
                Profile
              </Link>
              <Link 
                to="/dashboard/settings" 
                className="text-white hover:bg-[#222222] transition px-2 py-3 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings size={16} className="mr-3" />
                Settings
              </Link>
              
              <div className="border-t border-[#333333] mt-3"></div>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-red-400 hover:bg-[#222222] transition px-2 py-3 flex items-center text-left"
              >
                <LogOut size={16} className="mr-3" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default DashboardNavbar;
