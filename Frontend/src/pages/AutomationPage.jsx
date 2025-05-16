import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import ProjectHeader from '../components/project/ProjectHeader';
import RuleCreationForm from '../components/automation/RuleCreationForm';
import RulePreview from '../components/automation/RulePreview';
import { getProjectById } from '../services/projectService';
import { getProjectAutomations, createAutomation, deleteAutomation } from '../services/automationService';
import { AlertCircle, Loader, Zap } from 'lucide-react';

const AutomationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch project details
        const projectData = await getProjectById(id);
        setProject(projectData);
        
        // Fetch automation rules
        const automationData = await getProjectAutomations(id);
        setRules(automationData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 404) {
          setError('Project not found or you do not have access to it.');
        } else {
          setError('Failed to load automation data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleCreateRule = async (ruleData) => {
    try {
      setIsLoading(true);
      const newRule = await createAutomation({
        ...ruleData,
        projectId: id
      });
      setRules(prev => [newRule, ...prev]);
      setError(null);
    } catch (err) {
      console.error('Error creating automation rule:', err);
      setError('Failed to create automation rule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteRule = async (ruleId) => {
    try {
      setIsLoading(true);
      await deleteAutomation(ruleId);
      setRules(prev => prev.filter(rule => rule._id !== ruleId));
      setError(null);
    } catch (err) {
      console.error('Error deleting automation rule:', err);
      setError('Failed to delete automation rule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
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
            <p className="text-white/70">Loading project automation...</p>
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
        <ProjectHeader project={project} />
        
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Zap size={24} className="text-[#1DCD9F] mr-2" />
              Automation Rules
            </h2>
            
            <RuleCreationForm onCreateRule={handleCreateRule} />
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-4">Active Rules</h3>
            
            <AnimatePresence>
              {rules.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#222222] border border-[#333333] rounded-lg p-6 text-center"
                >
                  <Zap size={32} className="mx-auto text-white/30 mb-3" />
                  <h4 className="text-lg font-medium mb-2">No automation rules yet</h4>
                  <p className="text-white/70">
                    Create your first automation rule above to streamline your workflow.
                  </p>
                </motion.div>
              ) : (
                rules.map(rule => (
                  <RulePreview 
                    key={rule._id || rule.id} 
                    rule={rule} 
                    onDeleteRule={handleDeleteRule} 
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AutomationPage;
