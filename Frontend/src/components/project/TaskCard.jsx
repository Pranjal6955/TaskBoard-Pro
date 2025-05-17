import React, { useState, useEffect } from 'react';
import { Calendar, Tag, Clock, MoreVertical, AlertCircle } from 'lucide-react';
import TaskModal from './TaskModal';

const TaskCard = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  // Debug logging for task data
  useEffect(() => {
    console.log("Task data received in TaskCard:", task);
  }, [task]);

  // Function to format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get days remaining until due date
  const getDaysRemaining = (dateString) => {
    if (!dateString) return null;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate the difference in milliseconds and convert to days
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
  };

  // Function to get priority styling
  const getPriorityStyles = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high':
        return {
          bgColor: 'bg-red-500/30',
          borderColor: 'border-red-500',
          textColor: 'text-red-300',
          dotColor: 'bg-red-500'
        };
      case 'medium':
        return {
          bgColor: 'bg-yellow-500/30',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-300',
          dotColor: 'bg-yellow-500'
        };
      case 'low':
        return {
          bgColor: 'bg-blue-500/30',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-300',
          dotColor: 'bg-blue-500'
        };
      default:
        return {
          bgColor: 'bg-gray-500/30',
          borderColor: 'border-gray-500',
          textColor: 'text-gray-300',
          dotColor: 'bg-gray-500'
        };
    }
  };

  if (!task) {
    console.error("TaskCard received null or undefined task");
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 text-red-300">
        <AlertCircle size={16} className="mb-2" />
        Error: Invalid task data
      </div>
    );
  }

  const priorityStyles = getPriorityStyles(task.priority);

  return (
    <>
      <div 
        className="bg-[#181C1F] border border-[#23272A] rounded-xl p-4 hover:border-[#1DCD9F]/70 transition-all duration-200 cursor-pointer group shadow-md"
        onClick={() => setIsTaskModalOpen(true)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-white text-base">{task.title || 'Untitled Task'}</h3>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button className="text-white/60 hover:text-white p-1">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* Task ID for debugging */}
        <div className="text-xs text-gray-500 mb-2">ID: {task._id || 'No ID'}</div>

        {/* Status Badge */}
        <div className="flex items-center mb-2">
          <span 
            className={`px-2 py-0.5 rounded-full text-xs 
              ${task.status?.toLowerCase() === 'completed' ? 'bg-green-500/30 text-green-300 border border-green-500' :
                task.status?.toLowerCase() === 'in progress' ? 'bg-blue-500/30 text-blue-300 border border-blue-500' :
                task.status?.toLowerCase() === 'blocked' ? 'bg-red-500/30 text-red-300 border border-red-500' :
                'bg-yellow-500/30 text-yellow-300 border border-yellow-500'}`}
          >
            {task.status || 'To Do'}
          </span>
        </div>

        {/* Priority Badge */}
        <div className="flex items-center mb-3">
          <span 
            className={`px-2 py-0.5 rounded-full text-xs ${priorityStyles.bgColor} ${priorityStyles.textColor} border ${priorityStyles.borderColor} flex items-center`}
          >
            <span className={`h-2 w-2 rounded-full ${priorityStyles.dotColor} mr-1.5`}></span>
            {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Normal'}
          </span>
        </div>

        {/* Labels Row */}
        {Array.isArray(task.labels) && task.labels.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {task.labels.map((label, idx) => (
              <span
                key={`${label}-${idx}`}
                className="bg-[#23272A] text-white/80 text-xs px-2.5 py-1 rounded-full flex items-center border border-[#333333] hover:bg-[#2A2F33] transition-colors"
              >
                <Tag size={10} className="mr-1.5" />
                {label}
              </span>
            ))}
          </div>
        ) : null}

        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {task.description || 'No description provided'}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-xs text-white/60">
            <Calendar size={12} className="mr-1" />
            {formatDate(task.dueDate)}
          </div>
          {/* Due date indicator */}
          {task.dueDate && (
            <div className={`text-xs flex items-center ${
              getDaysRemaining(task.dueDate) === 'Overdue'
                ? 'text-red-400'
                : getDaysRemaining(task.dueDate) === 'Due today'
                  ? 'text-yellow-400'
                  : 'text-white/60'
            }`}>
              <Clock size={12} className="mr-1" />
              {getDaysRemaining(task.dueDate)}
            </div>
          )}
        </div>

        {/* Assignee if available */}
        {task.assignee && (
          <div className="mt-3 flex justify-end">
            <img 
              src={task.assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee.name || task.assignee.email || 'User')}&background=1A1A1A&color=FFFFFF`}
              alt={task.assignee.name || task.assignee.email || 'Assignee'}
              className="w-6 h-6 rounded-full"
              title={task.assignee.name || task.assignee.email || 'Assignee'}
            />
          </div>
        )}
      </div>
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          task={task}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
      )}
    </>
  );
};

export default TaskCard;
