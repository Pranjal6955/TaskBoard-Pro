import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, AlertCircle } from 'lucide-react';

const TaskCard = ({
  task,
  onClick,
  onDragStart,
  isDragging,
  index
}) => {
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
  
  return (
    <motion.div
      draggable
      onDragStart={onDragStart}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className={`bg-[#222222] p-4 rounded-lg border border-[#333333] cursor-pointer transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      } hover:border-[#1DCD9F]/50`}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-white font-medium text-base line-clamp-1">{task.title}</h4>
        <div className={`h-2 w-2 rounded-full ${priorityColors[task.priority]}`}></div>
      </div>
      
      <p className="text-white/70 text-sm mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {task.labels.map((label, i) => (
          <span 
            key={i}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-[#1DCD9F]/20 text-[#1DCD9F]"
          >
            <Tag size={10} className="mr-1" />
            {label}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center">
          <img 
            src={task.assignee.avatar} 
            alt={task.assignee.name} 
            className="w-6 h-6 rounded-full border border-[#333333]" 
            title={task.assignee.name}
          />
        </div>
        
        <div className={`flex items-center text-xs ${isOverdue ? 'text-red-400' : 'text-white/60'}`}>
          {isOverdue ? <AlertCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
          {formatDate(task.dueDate)}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
