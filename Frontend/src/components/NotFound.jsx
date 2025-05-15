import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

const NotFound = ({ message = "The resource you're looking for doesn't exist" }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="rounded-full bg-error/10 p-4 mb-4">
        <FiAlertCircle className="text-4xl text-error" />
      </div>
      
      <h2 className="text-2xl font-display font-bold text-neutral-800 mb-2">
        Not Found
      </h2>
      
      <p className="text-neutral-600 text-center max-w-md mb-6">
        {message}
      </p>
      
      <Link 
        to="/dashboard" 
        className="btn-primary inline-flex items-center"
      >
        <FiArrowLeft className="mr-2" />
        Back to Dashboard
      </Link>
    </motion.div>
  );
};

export default NotFound;
