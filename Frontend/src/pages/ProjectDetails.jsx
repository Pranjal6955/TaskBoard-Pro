import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMoreVertical, FiUsers, FiMessageSquare, FiCalendar } from 'react-icons/fi';
import NotFound from '../components/NotFound';
import { getProjectDetails } from '../api/projects';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const data = await getProjectDetails(projectId);
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <NotFound message={error} />;
  if (!project) return <NotFound message="Project not found" />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-neutral-800">{project.name}</h1>
      <p className="text-neutral-600 mt-2">{project.description}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-neutral-800">Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {project.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-neutral-800">Automation Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[
            { title: 'Due Date Reminder', description: 'Send a notification 24h before a task is due' },
            { title: 'Auto Assign Review', description: 'Assign tasks to QA when moved to review' },
            { title: 'Completion Badge', description: 'Award a badge when user completes 5 tasks' },
          ].map((template, i) => (
            <div key={i} className="border border-neutral-200 rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all">
              <h3 className="font-medium text-neutral-800">{template.title}</h3>
              <p className="text-sm text-neutral-600 mt-1">{template.description}</p>
              <button className="mt-3 text-sm text-primary font-medium hover:text-primary-hover">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Task Card Component
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

export default ProjectDetails;