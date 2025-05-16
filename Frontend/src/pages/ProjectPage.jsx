import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import ProjectHeader from '../components/project/ProjectHeader';
import KanbanBoard from '../components/project/KanbanBoard';
import { projects } from '../assets/mockData';
import { Loader } from 'lucide-react';

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch project details
    setTimeout(() => {
      const foundProject = projects.find(p => p.id === id);
      setProject(foundProject);
      setIsLoading(false);
    }, 800);
  }, [id]);
  
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
        <ProjectHeader project={project} />
        
        <div className="container mx-auto px-4 py-6">
          <KanbanBoard />
        </div>
      </main>
    </div>
  );
};

export default ProjectPage;
