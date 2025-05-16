import React from 'react';
import { Calendar, Tag, AlertCircle, Clock } from 'lucide-react';

const TaskCard = ({ task, onClick }) => {
  // Ensure the task exists
  if (!task) {
    return (
      <div className="bg-[#1A1A1A] p-4 rounded-lg shadow-md mb-3 border border-[#333333] hover:border-[#1DCD9F]/50 cursor-pointer">
        <p className="text-white/50">Invalid task data</p>
      </div>
    );
  }
  
  const priorityColors = {
    high: 'bg-red-500 text-white',
    medium: 'bg-yellow-500 text-black',
    low: 'bg-blue-500 text-white'
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div 
      className="bg-[#1A1A1A] p-4 rounded-lg shadow-md mb-3 border border-[#333333] hover:border-[#1DCD9F]/50 cursor-pointer transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-white">{task.title}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[task.priority || 'medium']}`}>
          {task.priority?.charAt(0).toUpperCase() || 'M'}
        </span>
      </div>
      
      {task.description && (
        <p className="text-white/60 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex flex-wrap gap-1 mb-3">
        {task.labels && task.labels.length > 0 ? (
          task.labels.map((label, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#1DCD9F]/20 text-[#1DCD9F]"
            >
              <Tag size={10} className="mr-1" />
              {label}
            </span>
          ))
        ) : null}
      </div>
      
      <div className="flex justify-between items-center text-white/60 text-xs">
        {task.dueDate && (
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            {formatDate(task.dueDate)}
          </div>
        )}
        
        {task.assignee && (
          <div className="flex items-center">
            <img
              src={task.assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee.name || 'User')}&background=1A1A1A&color=FFFFFF`}
              alt={task.assignee.name || ''}
              className="w-6 h-6 rounded-full border border-[#333333]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
