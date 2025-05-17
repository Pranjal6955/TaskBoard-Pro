import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { 
  Calendar, 
  Users, 
  Settings, 
  PieChart, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  UserCog,
  Mail
} from 'lucide-react';
import InviteMemberModal from './InviteMemberModal';
import Tooltip from '../ui/Tooltip';
import ProjectSettingsModal from './ProjectSettingsModal';

const ProjectHeader = ({ project, onProjectUpdated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showMembersPopup, setShowMembersPopup] = useState(false);
  
  // Add a click outside handler to close the members popup
  const membersRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (membersRef.current && !membersRef.current.contains(event.target)) {
        setShowMembersPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Calculate project progress based on tasks if available, or use the provided value
  const progress = project.progress || 0;

  // Ensure we have a valid project ID by checking various possible properties
  const projectId = project._id || project.id;
  
  // Determine project status based on progress and due date
  const getProjectStatus = () => {
    if (!project.dueDate) return { icon: <Clock size={16} />, label: 'No deadline', color: 'text-gray-400' };
    
    const today = new Date();
    const dueDate = new Date(project.dueDate);
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    if (progress >= 100) return { icon: <CheckCircle size={16} />, label: 'Completed', color: 'text-green-500' };
    if (daysLeft < 0) return { icon: <AlertTriangle size={16} />, label: 'Overdue', color: 'text-red-500' };
    if (daysLeft <= 3) return { icon: <AlertTriangle size={16} />, label: 'Due soon', color: 'text-yellow-500' };
    if (progress < 30 && daysLeft < 7) return { icon: <AlertTriangle size={16} />, label: 'At risk', color: 'text-orange-400' };
    
    return { icon: <CheckCircle size={16} />, label: 'On track', color: 'text-[#1DCD9F]' };
  };
  
  const status = getProjectStatus();
  
  const tabs = [
    { id: 'tasks', label: 'Tasks', path: `/projects/${projectId}` },
    { id: 'automations', label: 'Automations', path: `/projects/${projectId}/automation` }
  ];

  const handleMemberUpdate = (updatedMembers) => {
    if (onProjectUpdated) {
      onProjectUpdated({
        ...project,
        members: updatedMembers
      });
    }
  };

  const handleProjectUpdate = async (updatedProject) => {
    try {
      // Here you would typically call an API to update the project
      // For now, we'll just pass the updated project to the parent component
      if (onProjectUpdated) {
        onProjectUpdated(updatedProject);
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };
  
  const handleProjectDelete = async (projectId) => {
    try {
      // Here you would typically call an API to delete the project
      // After successful deletion, navigate to the projects list
      navigate('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  };
  
  return (
    <div className="bg-[#222222] border-b border-[#333333] shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
          {/* Project Title and Description */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white mb-1">{project.title}</h1>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.color} bg-opacity-20 bg-current`}>
                {status.icon}
                <span>{status.label}</span>
              </div>
            </div>
            <p className="text-white/70 line-clamp-2">{project.description}</p>
          </div>
          
          {/* Project Actions */}
          <div className="flex items-center space-x-3 self-end md:self-start">
            <div className="relative">
              <Tooltip content="Team Members">
                <div 
                  ref={membersRef}
                  className="flex -space-x-2 mr-2 cursor-pointer group" 
                  onClick={() => setShowMembersPopup(prev => !prev)}
                >
                  {project.members && project.members.length > 0 ? (
                    project.members.slice(0, 3).map((member, index) => (
                      <div key={member.id || member.userId || member._id} className="relative">
                        <img
                          src={member.avatar || member.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.email || 'User')}&background=1A1A1A&color=FFFFFF`}
                          alt={member.name || member.email || 'User'}
                          className="w-8 h-8 rounded-full border-2 border-[#222222] transition-all duration-200 hover:scale-110 hover:z-10"
                          style={{ zIndex: project.members.length - index }}
                        />
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#222222] opacity-0 transition-opacity group-hover:opacity-100"></span>
                      </div>
                    ))
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-[#222222] bg-[#333333] flex items-center justify-center">
                      <Users size={14} />
                    </div>
                  )}
                  
                  {project.members && project.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-[#333333] border-2 border-[#222222] flex items-center justify-center text-xs text-white hover:bg-[#444444] hover:scale-110 transition-all hover:z-10">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
              </Tooltip>
              
              <AnimatePresence>
                {showMembersPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute mt-2 top-full left-0 z-50 bg-[#2A2A2A] rounded-lg shadow-lg border border-[#333333] p-2 w-64"
                  >
                    <h3 className="text-white text-sm font-semibold mb-2 px-2">Team Members ({project.members?.length || 0})</h3>
                    <div className="max-h-60 overflow-y-auto">
                      {project.members && project.members.length > 0 ? (
                        project.members.map((member) => (
                          <div 
                            key={member.id || member.userId || member._id} 
                            className="flex items-center p-2 hover:bg-[#333333] rounded-md transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle member click - could open profile, etc.
                            }}
                          >
                            <img
                              src={member.avatar || member.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.email || 'User')}&background=1A1A1A&color=FFFFFF`}
                              alt={member.name || member.email || 'User'}
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <div>
                              <div className="text-white text-sm font-medium">{member.name || 'Unknown User'}</div>
                              <div className="text-white/60 text-xs">{member.email || 'No email'}</div>
                            </div>
                            <div className="ml-auto">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-white/70 text-sm p-2">No team members yet</div>
                      )}
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#333333] px-2">
                      <button 
                        className="text-[#1DCD9F] text-xs hover:underline flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsInviteModalOpen(true);
                          setShowMembersPopup(false);
                        }}
                      >
                        <UserPlus size={12} className="mr-1" />
                        Invite more members
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Tooltip content="Invite Members">
              <Button 
                variant="outline" 
                size="sm" 
                icon={<UserPlus size={14} />}
                onClick={() => setIsInviteModalOpen(true)}
                className="hover:bg-[#1DCD9F]/10"
              >
                Invite
              </Button>
            </Tooltip>
            
            <Tooltip content="Project Settings">
              <Button 
                variant="outline" 
                size="sm"
                className="!bg-transparent hover:bg-white/10"
                icon={<Settings size={14} />}
                onClick={() => setIsSettingsModalOpen(true)}
              />
            </Tooltip>
          </div>
        </div>

        {/* Project Details and Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center text-white/70 text-sm">
              <Calendar size={16} className="mr-2 text-[#1DCD9F]" />
              <Tooltip content={project.dueDate ? `Due date: ${new Date(project.dueDate).toDateString()}` : 'No deadline set'}>
                <span>Due {formatDate(project.dueDate)}</span>
              </Tooltip>
            </div>
            <div className="w-full sm:w-40">
              <div className="flex items-center justify-between text-white/70 text-sm mb-1">
                <div className="flex items-center">
                  <PieChart size={16} className="mr-2 text-[#1DCD9F]" />
                  Progress
                </div>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-[#333333] rounded-full h-1.5">
                <div 
                  className="bg-[#1DCD9F] h-1.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1 p-1 bg-[#2A2A2A] rounded-lg">
            {tabs.map((tab) => {
              const isActive = currentPath === tab.path;
              
              return (
                <Link key={tab.id} to={tab.path}>
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                    className={`px-4 py-2 rounded-md transition-all ${
                      isActive
                        ? 'bg-[#1DCD9F] text-black font-medium shadow-md'
                        : 'text-white/70 hover:bg-[#333333] hover:text-white'
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
      
      <ProjectSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        project={project}
        onProjectUpdate={handleProjectUpdate}
        onProjectDelete={handleProjectDelete}
      />
    </div>
  );
};

export default ProjectHeader;
