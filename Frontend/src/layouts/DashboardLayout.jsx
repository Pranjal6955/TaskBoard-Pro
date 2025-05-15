import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiFolder, FiUser, FiSettings, FiMenu, FiX, FiLogOut, FiBell } from 'react-icons/fi';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Projects', path: '/dashboard/projects', icon: <FiFolder /> },
    { name: 'Profile', path: '/dashboard/profile', icon: <FiUser /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <FiSettings /> },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:z-0`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 border-b border-neutral-200">
          <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            TaskBoard Pro
          </h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`
                  }
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="border-t border-neutral-200 my-6 pt-4">
            <button className="flex items-center w-full p-3 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-all duration-200">
              <span className="mr-3 text-lg"><FiLogOut /></span>
              Logout
            </button>
          </div>
        </nav>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm border-b border-neutral-200 py-3 px-4 flex items-center justify-between">
          <button 
            className="lg:hidden text-neutral-600 hover:text-neutral-900 focus:outline-none"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
            </button>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
                U
              </div>
              <span className="ml-2 font-medium hidden sm:inline">User Name</span>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
