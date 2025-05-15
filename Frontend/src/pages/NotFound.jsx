import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-secondary-light flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <motion.h1 
            className="text-9xl font-display font-bold text-neutral-800 opacity-10"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            404
          </motion.h1>
          <h2 className="text-2xl font-display font-bold text-neutral-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            Page Not Found
          </h2>
        </div>
        
        <p className="mt-4 text-neutral-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/dashboard" 
          className="mt-8 inline-flex items-center btn-primary"
        >
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
