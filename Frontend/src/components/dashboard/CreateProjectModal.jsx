import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Calendar } from 'lucide-react';

/**
 * @typedef {Object} CreateProjectModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {(project: any) => void} onCreateProject
 */

/**
 * Modal for creating a new project
 * @param {CreateProjectModalProps} props
 */
const CreateProjectModal = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Handle form input changes
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e 
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  /**
   * Handle form submission
   * @param {React.FormEvent} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.dueDate) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const projectData = {
        ...formData
      };
      
      await onCreateProject(projectData);
      setFormData({ title: '', description: '', dueDate: '' });
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={handleSubmit} 
        loading={isLoading}
        disabled={!formData.title || !formData.description || !formData.dueDate}
      >
        Create Project
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      footer={modalFooter}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-2">
            Project Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
            placeholder="Enter project title"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
            placeholder="Describe the project"
            required
          />
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-white/80 mb-2 flex items-center">
            <Calendar size={16} className="mr-2 text-[#1DCD9F]" />
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
            required
          />
        </div>
        
        <p className="text-xs text-white/60">
          You'll be able to invite team members after creating the project.
        </p>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
