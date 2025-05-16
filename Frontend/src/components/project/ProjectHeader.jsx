import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import { Calendar, Users, Settings, PieChart, UserPlus } from 'lucide-react';
import InviteMemberModal from './InviteMemberModal';

const ProjectHeader = ({ project, onProjectUpdated }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Calculate project progress based on tasks if available, or use the provided value
  const progress = project.progress || 0;

  // Ensure we have a valid project ID by checking various possible properties
  const projectId = project._id || project.id;
  
  const tabs = [
    { id: 'tasks', label: 'Tasks', path: `/project/${projectId}` },
    { id: 'automations', label: 'Automations', path: `/project/${projectId}/automation` }
  ];

  const handleMemberUpdate = (updatedMembers) => {
    if (onProjectUpdated) {
      onProjectUpdated({
        ...project,
        members: updatedMembers
      });
    }
  };
  
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
              {project.members && project.members.length > 0 ? (
                project.members.slice(0, 3).map((member) => (
                  <img
                    key={member.id || member.userId || member._id}
                    src={member.avatar || member.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.email || 'User')}&background=1A1A1A&color=FFFFFF`}
                    alt={member.name || member.email || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-[#222222]"
                    title={member.name || member.email || 'Team member'}
                  />
                ))
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-[#222222] bg-[#333333] flex items-center justify-center">
                  <Users size={14} />
                </div>
              )}
              
              {project.members && project.members.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-[#333333] border-2 border-[#222222] flex items-center justify-center text-xs text-white">
                  +{project.members.length - 3}
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              icon={<UserPlus size={14} />}
              onClick={() => setIsInviteModalOpen(true)}
            >
              Invite
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
              Progress: {progress}%
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
      
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)} 
        projectId={projectId}
        currentMembers={project.members || []}
        onMembersUpdated={handleMemberUpdate}
      />
    </div>
  );
};

export default ProjectHeader;
