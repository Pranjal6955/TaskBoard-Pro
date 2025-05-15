import React from 'react';
import { motion } from 'framer-motion';
import { FiMoreVertical, FiUsers, FiMessageSquare, FiCalendar } from 'react-icons/fi';

const TaskCard = ({ task }) => {
  const getPriorityColor = (priority) => {
    return priority === 'High' ? 'text-error' : 
           priority === 'Medium' ? 'text-warning' : 'text-neutral-500';
  };

  return (
    <motion.div 
      className="bg-white p-3 rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-all"
      whileHover={{ y: -2 }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-neutral-800">{task.title}</h3>
        <button className="text-neutral-400 hover:text-neutral-700">
          <FiMoreVertical size={16} />
        </button>
      </div>
      
      {task.description && (
        <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{task.description}</p>
      )}
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center">
          {task.assignee ? (
            <div 
              className={`${task.assignee.color} h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-medium`}
              title={task.assignee.name}
            >
              {task.assignee.avatar}
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400">
              <FiUsers size={12} />
            </div>
          )}
          
          <div className="ml-2 flex items-center">
            <span className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs">
          {task.comments > 0 && (
            <div className="flex items-center text-neutral-500" title={`${task.comments} comments`}>
              <FiMessageSquare size={12} className="mr-1" />
              {task.comments}
            </div>
          )}
          
          <div className="flex items-center text-neutral-500" title={`Due: ${task.dueDate}`}>
            <FiCalendar size={12} className="mr-1" />
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
