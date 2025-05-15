import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Temporarily navigate to dashboard on any register attempt
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              <FiUser />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="John Doe"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              <FiMail />
            </div>
            <input
              type="email"
              className="input pl-10"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              <FiLock />
            </div>
            <input
              type="password"
              className="input pl-10"
              placeholder="••••••••"
              required
            />
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Must be at least 8 characters
          </p>
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center group"
        >
          Create Account
          <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2.5 px-4 border border-neutral-300 rounded-lg shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-neo"
          >
            <FcGoogle className="text-xl" />
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center py-2.5 px-4 border border-neutral-300 rounded-lg shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-neo"
          >
            <FiGithub className="text-xl" />
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link to="/" className="font-medium text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
};

export default Register;
