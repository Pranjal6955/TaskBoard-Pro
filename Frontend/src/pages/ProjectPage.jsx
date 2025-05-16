import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import ProjectHeader from '../components/project/ProjectHeader';
import KanbanBoard from '../components/project/KanbanBoard';
import { getProjectById } from '../services/projectService';
import { getProjectTasks } from '../services/taskService';
import { AlertCircle, Loader } from 'lucide-react';

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) {
        setError("Invalid project ID. Redirecting to dashboard...");
        setTimeout(() => navigate('/dashboard'), 2000);
        return;
      }
      
      try {
        setIsLoading(true);
        const projectData = await getProjectById(id);
        
        // Format project data to ensure consistent structure
        const formattedProject = {
          ...projectData,
          id: projectData._id || projectData.id, // Ensure we have id available
          _id: projectData._id || projectData.id, // Ensure we have _id available
          // Standardize members format for the ProjectHeader component
          members: (projectData.members || []).map(member => ({
            id: member.userId || member._id || member.id,
            userId: member.userId || member._id || member.id,
            name: member.name || (member.email ? member.email.split('@')[0] : 'User'),
            email: member.email || '',
            avatar: member.photoURL || member.avatar || 
              `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || member.email || 'User')}&background=1A1A1A&color=FFFFFF`,
            role: member.role || 'member'
          }))
        };
        
        setProject(formattedProject);
        
        const tasksData = await getProjectTasks(id);
        setTasks(tasksData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        if (err.response?.status === 404) {
          setError('Project not found or you do not have access to it.');
        } else {
          setError('Failed to load project data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <Loader size={40} className="text-[#1DCD9F] animate-spin mb-4" />
            <p className="text-white/70">Loading project...</p>
          </motion.div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-[#000000] text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-20">
          <div className="bg-[#222222] border border-[#333333] rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <AlertCircle size={24} />
              <h2 className="text-xl font-medium">Error</h2>
            </div>
            <p className="text-white/70 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-[#1DCD9F] text-black rounded-md hover:bg-[#19B589] transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="min-h-screen bg-[#000000] text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-20">
          <div className="bg-[#222222] border border-[#333333] rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium mb-2">Project not found</h2>
            <p className="text-white/70">The project you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <Navbar />
      
      <main className="pt-16">
        <ProjectHeader project={project} onProjectUpdated={(updatedProject) => setProject(updatedProject)} />
        
        <div className="container mx-auto px-4 py-6">
          <KanbanBoard projectId={id} initialTasks={tasks || []} />
        </div>
      </main>
    </div>
  );
};

export default ProjectPage;
