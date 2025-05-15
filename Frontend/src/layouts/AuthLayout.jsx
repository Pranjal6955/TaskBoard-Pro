import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-secondary-light flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-neo border border-neutral-200">
          <div className="mb-6 text-center">
            <motion.div
              className="inline-block"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
            >
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TaskBoard Pro
              </h1>
            </motion.div>
            <p className="text-neutral-600 mt-2">Collaborate & Automate Like Never Before</p>
          </div>
          
          <Outlet />
        </div>
      </motion.div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
    </div>
  );
};

export default AuthLayout;
