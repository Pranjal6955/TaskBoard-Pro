import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ children, content, position = 'bottom' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Determine tooltip position
  const getPosition = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2';
      case 'right':
        return 'left-full ml-2';
      case 'left':
        return 'right-full mr-2';
      default: // bottom
        return 'top-full mt-2';
    }
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${getPosition()} whitespace-nowrap px-2 py-1 rounded bg-[#333333] text-white text-xs shadow-lg pointer-events-none`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
