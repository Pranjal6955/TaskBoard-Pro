import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';
import ProjectCard from '../components/dashboard/ProjectCard';
import CreateProjectModal from '../components/dashboard/CreateProjectModal';
import { getProjects, createProject } from '../services/projectService';
import { Plus, Search, Filter, Briefcase, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getProjects();
        setProjectsList(data);
        setFilteredProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const handleCreateProject = async (projectData) => {
    setIsLoading(true);
    try {
      const newProject = await createProject(projectData);
      setProjectsList(prev => [newProject, ...prev]);
      setFilteredProjects(prev => [newProject, ...prev]);
      setIsCreateModalOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredProjects(projectsList);
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const filtered = projectsList.filter(
        project => 
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setFilteredProjects(filtered);
      setIsLoading(false);
    }, 300);
  };
  
  const resetSearch = () => {
    setSearchQuery('');
    setFilteredProjects(projectsList);
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
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}
        
        {isLoading && !error ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1DCD9F]"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
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
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project._id || project.id}
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
