import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';
import ProjectCard from '../components/dashboard/ProjectCard';
import CreateProjectModal from '../components/dashboard/CreateProjectModal';
import { projects } from '../assets/mockData';
import { Plus, Search, Filter, Briefcase } from 'lucide-react';

const DashboardPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectsList, setProjectsList] = useState(projects);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCreateProject = (project) => {
    setProjectsList([project, ...projectsList]);
    setIsCreateModalOpen(false);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setProjectsList(projects);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate search API call
    setTimeout(() => {
      const filtered = projects.filter(
        project => 
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setProjectsList(filtered);
      setIsLoading(false);
    }, 600);
  };
  
  const resetSearch = () => {
    setSearchQuery('');
    setProjectsList(projects);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projects Dashboard</h1>
            <p className="text-white/70 mt-1">Manage and track your team's projects</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              variant="primary" 
              onClick={() => setIsCreateModalOpen(true)}
              icon={<Plus size={16} />}
            >
              Create Project
            </Button>
          </div>
        </div>
        
        <div className="bg-[#222222] p-4 rounded-lg mb-8 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
              />
            </div>
            <Button 
              variant="secondary" 
              type="submit"
              loading={isLoading}
            >
              Search
            </Button>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={resetSearch}
              >
                Clear
              </Button>
            )}
          </form>
          
          <Button 
            variant="outline"
            className="md:w-auto w-full"
            icon={<Filter size={16} />}
          >
            Filters
          </Button>
        </div>
        
        {projectsList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#222222] border border-[#333333] rounded-lg p-8 text-center"
          >
            <Briefcase size={48} className="mx-auto text-white/30 mb-4" />
            <h2 className="text-xl font-medium mb-2">No projects found</h2>
            <p className="text-white/70 mb-6">
              {searchQuery 
                ? `No projects matching "${searchQuery}"`
                : "You haven't created any projects yet"
              }
            </p>
            <Button 
              variant="primary" 
              onClick={() => setIsCreateModalOpen(true)}
              icon={<Plus size={16} />}
            >
              Create Your First Project
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {projectsList.map((project, index) => (
                <ProjectCard 
                  key={project.id}
                  {...project}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
      
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default DashboardPage;
