import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import ProjectHeader from '../components/project/ProjectHeader';
import RuleCreationForm from '../components/automation/RuleCreationForm';
import RulePreview from '../components/automation/RulePreview';
import { projects, automationRules } from '../assets/mockData';
import { Loader, Zap } from 'lucide-react';

const AutomationPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch project details and automation rules
    setTimeout(() => {
      const foundProject = projects.find(p => p.id === id);
      setProject(foundProject);
      setRules(automationRules);
      setIsLoading(false);
    }, 800);
  }, [id]);
  
  const handleCreateRule = (rule) => {
    setRules(prev => [rule, ...prev]);
  };
  
  const handleDeleteRule = (ruleId) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
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
                    key={rule.id} 
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
