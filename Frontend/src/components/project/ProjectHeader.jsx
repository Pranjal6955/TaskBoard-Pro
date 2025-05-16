import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import { Calendar, Users, Settings, PieChart } from 'lucide-react';

const ProjectHeader = ({ project }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const tabs = [
    { id: 'tasks', label: 'Tasks', path: `/project/${project.id}` },
    { id: 'automations', label: 'Automations', path: `/project/${project.id}/automation` }
  ];
  
  return (
    <div className="bg-[#222222] border-b border-[#333333]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{project.title}</h1>
            <p className="text-white/70">{project.description}</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <div className="flex -space-x-2 mr-2">
              {project.members.map((member) => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full border-2 border-[#222222]"
                  title={member.name}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              icon={<Users size={14} />}
            >
              Manage Team
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="!bg-transparent"
              icon={<Settings size={14} />}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-white/70 text-sm">
              <Calendar size={16} className="mr-2 text-[#1DCD9F]" />
              Due {formatDate(project.dueDate)}
            </div>
            
            <div className="flex items-center text-white/70 text-sm">
              <PieChart size={16} className="mr-2 text-[#1DCD9F]" />
              Progress: {project.progress}%
            </div>
          </div>
          
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const isActive = currentPath === tab.path;
              
              return (
                <Link key={tab.id} to={tab.path}>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-[#1DCD9F] text-black font-medium'
                        : 'text-white/70 hover:bg-[#333333]'
                    }`}
                  >
                    {tab.label}
                  </motion.button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
