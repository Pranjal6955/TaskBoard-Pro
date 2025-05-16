import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Calendar, User, Users } from 'lucide-react';

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
  
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const teamMembers = [
    { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Maya Patel', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '3', name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'Sarah Lee', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?img=12' }
  ];
  
  /**
   * Handle form input changes
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e 
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  /**
   * Toggle team member selection
   * @param {string} id 
   */
  const toggleMember = (id) => {
    setSelectedMembers(prev => 
      prev.includes(id)
        ? prev.filter(memberId => memberId !== id)
        : [...prev, id]
    );
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
    
    // Mock API call delay
    setTimeout(() => {
      const newProject = {
        id: `p${Math.floor(Math.random() * 1000)}`,
        ...formData,
        progress: 0,
        members: teamMembers.filter(member => selectedMembers.includes(member.id)),
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      onCreateProject(newProject);
      setFormData({ title: '', description: '', dueDate: '' });
      setSelectedMembers([]);
      setIsLoading(false);
      onClose();
    }, 1000);
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
        disabled={!formData.title || !formData.description || !formData.dueDate || selectedMembers.length === 0}
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
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2 flex items-center">
            <Users size={16} className="mr-2 text-[#1DCD9F]" />
            Team Members
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleMember(member.id)}
                className={`flex items-center p-3 border ${
                  selectedMembers.includes(member.id) 
                    ? 'border-[#1DCD9F] bg-[#1DCD9F]/10' 
                    : 'border-[#333333] bg-[#1A1A1A]'
                } rounded-md cursor-pointer transition-all duration-200`}
              >
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-8 h-8 rounded-full mr-3 border-2 border-[#333333]" 
                />
                <span className="text-white">{member.name}</span>
              </motion.div>
            ))}
          </div>
          {selectedMembers.length === 0 && (
            <p className="text-sm text-red-400 mt-2">Please select at least one team member</p>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
