import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar } from 'react-icons/fi';

const ProjectCard = ({ project }) => {
  const getColorClass = (color) => {
    const colors = {
      primary: 'from-primary to-primary-dark',
      secondary: 'from-secondary to-secondary-hover',
      accent: 'from-accent to-accent-hover',
      success: 'from-success to-emerald-700',
      warning: 'from-warning to-amber-700',
    };
    return colors[color] || colors.primary;
  };

  return (
    <motion.div 
      className="card group overflow-visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
    >
      <div className={`h-2 bg-gradient-to-r ${getColorClass(project.color)} rounded-t-xl`}></div>
      <div className="p-5">
        <Link to={`/dashboard/projects/${project.id}`}>
          <h2 className="font-display font-bold text-lg text-neutral-800 group-hover:text-primary transition-colors">
            {project.title}
          </h2>
        </Link>
        <p className="text-neutral-600 text-sm mt-2 line-clamp-2">{project.description}</p>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-neutral-600 mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${getColorClass(project.color)}`} 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center text-neutral-600">
            <FiUsers className="mr-1" />
            <span>{project.members} members</span>
          </div>
          <div className="flex items-center text-neutral-600">
            <FiCalendar className="mr-1" />
            <span>{project.dueDate}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className={`badge ${
              project.status === 'Almost Done' ? 'badge-primary' :
              project.status === 'In Progress' ? 'bg-warning/20 text-warning' :
              project.status === 'Just Started' ? 'bg-neutral-200 text-neutral-700' :
              'badge-secondary'
            }`}>
              {project.status}
            </span>
          </div>
          <div className="text-sm text-neutral-600">
            {project.tasks.completed}/{project.tasks.total} tasks
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
