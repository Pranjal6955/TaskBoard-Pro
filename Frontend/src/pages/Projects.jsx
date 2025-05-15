import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiFolder, FiUsers, FiCalendar, FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';

const Projects = () => {
  const [viewMode, setViewMode] = useState('grid');
  
  // Placeholder data
  const projects = [
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'Complete redesign of the company online store with modern UI and improved checkout flow.',
      progress: 70,
      members: 5,
      tasks: { total: 24, completed: 16 },
      dueDate: 'Oct 15, 2023',
      status: 'In Progress',
      color: 'primary',
    },
    {
      id: '2',
      title: 'Mobile App Redesign',
      description: 'Revamp the existing mobile application with new features and improved performance.',
      progress: 45,
      members: 3,
      tasks: { total: 18, completed: 8 },
      dueDate: 'Nov 20, 2023',
      status: 'In Progress',
      color: 'accent',
    },
    {
      id: '3',
      title: 'Backend Services',
      description: 'Develop new API endpoints and optimize existing database queries.',
      progress: 90,
      members: 4,
      tasks: { total: 20, completed: 18 },
      dueDate: 'Sep 30, 2023',
      status: 'Almost Done',
      color: 'secondary',
    },
    {
      id: '4',
      title: 'Marketing Website',
      description: 'Create a new marketing website with interactive features and animations.',
      progress: 20,
      members: 2,
      tasks: { total: 15, completed: 3 },
      dueDate: 'Dec 10, 2023',
      status: 'Just Started',
      color: 'warning',
    },
    {
      id: '5',
      title: 'Data Analytics Dashboard',
      description: 'Build an interactive dashboard showing key business metrics and reports.',
      progress: 60,
      members: 3,
      tasks: { total: 22, completed: 13 },
      dueDate: 'Nov 5, 2023',
      status: 'In Progress',
      color: 'success',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Projects</h1>
          <p className="text-neutral-600">Manage and track all your team's projects</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link 
            to="/dashboard/projects/new"
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" />
            New Project
          </Link>
        </div>
      </motion.div>

      {/* Filters and search */}
      <motion.div 
        className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 w-full h-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="flex space-x-2">
          <button className="btn border border-neutral-300 bg-white text-neutral-700 flex items-center">
            <FiFilter className="mr-2" />
            Filter
          </button>
          
          <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
            <button 
              className={`px-3 py-2 flex items-center ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-neutral-700'}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid />
            </button>
            <button 
              className={`px-3 py-2 flex items-center ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-neutral-700'}`}
              onClick={() => setViewMode('list')}
            >
              <FiList />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Projects list */}
      {viewMode === 'grid' ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {projects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

// Project Card Component
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

// Project List Item Component
const ProjectListItem = ({ project }) => {
  return (
    <motion.div 
      className="card p-4 group"
      variants={{
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="sm:flex-1">
          <Link to={`/dashboard/projects/${project.id}`}>
            <h2 className="font-display font-bold text-lg text-neutral-800 group-hover:text-primary transition-colors flex items-center">
              <FiFolder className={`mr-2 ${
                project.color === 'primary' ? 'text-primary' :
                project.color === 'secondary' ? 'text-secondary' :
                project.color === 'accent' ? 'text-accent' :
                project.color === 'success' ? 'text-success' : 'text-warning'
              }`} />
              {project.title}
            </h2>
          </Link>
          <p className="text-neutral-600 text-sm mt-1 hidden sm:block">{project.description}</p>
        </div>
        
        <div className="hidden lg:block w-48">
          <div className="flex justify-between text-sm text-neutral-600 mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                project.color === 'primary' ? 'bg-primary' :
                project.color === 'secondary' ? 'bg-secondary' :
                project.color === 'accent' ? 'bg-accent' :
                project.color === 'success' ? 'bg-success' : 'bg-warning'
              }`} 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex sm:items-center gap-3 text-sm sm:w-auto w-full justify-between">
          <div className="flex items-center text-neutral-600">
            <FiUsers className="mr-1" /> {project.members}
          </div>
          <div className="flex items-center text-neutral-600">
            <span className={`badge ${
              project.status === 'Almost Done' ? 'badge-primary' :
              project.status === 'In Progress' ? 'bg-warning/20 text-warning' :
              project.status === 'Just Started' ? 'bg-neutral-200 text-neutral-700' :
              'badge-secondary'
            }`}>
              {project.status}
            </span>
          </div>
          <div className="flex items-center text-neutral-600">
            <FiCalendar className="mr-1" /> {project.dueDate}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;
