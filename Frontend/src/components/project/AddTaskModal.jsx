import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Calendar, Tag, AlertCircle } from 'lucide-react';

const AddTaskModal = ({
  isOpen,
  onClose,
  onTaskCreated,
  columnType
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assigneeId: '1',
    labels: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const teamMembers = [
    { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Maya Patel', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '3', name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'Sarah Lee', avatar: 'https://i.pravatar.cc/150?img=4' }
  ];
  
  const availableLabels = [
    'design', 'development', 'marketing', 'research', 'testing', 'planning', 'ui/ux', 'backend', 'frontend'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleLabel = (label) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label]
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.dueDate) {
      return;
    }
    
    setIsLoading(true);
    
    // Mock API call delay
    setTimeout(() => {
      const assignee = teamMembers.find(member => member.id === formData.assigneeId);
      
      const newTask = {
        id: `task-${Math.floor(Math.random() * 1000)}`,
        ...formData,
        assignee: assignee,
        createdAt: new Date().toISOString()
      };
      
      onTaskCreated(newTask);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assigneeId: '1',
        labels: []
      });
      
      setIsLoading(false);
      onClose();
    }, 800);
  };
  
  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={() => handleSubmit(new Event('submit'))} 
        loading={isLoading}
        disabled={!formData.title || !formData.description || !formData.dueDate}
      >
        Create Task
      </Button>
    </div>
  );
  
  const columnTitles = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Task to ${columnTitles[columnType] || 'Column'}`}
      footer={modalFooter}
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-2">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
            placeholder="Enter task title"
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
            placeholder="Describe the task"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-white/80 mb-2 flex items-center">
              <AlertCircle size={16} className="mr-2 text-[#1DCD9F]" />
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
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
        </div>
        
        <div>
          <label htmlFor="assigneeId" className="block text-sm font-medium text-white/80 mb-2">
            Assignee
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setFormData(prev => ({ ...prev, assigneeId: member.id }))}
                className={`flex flex-col items-center p-2 border ${
                  formData.assigneeId === member.id
                    ? 'border-[#1DCD9F] bg-[#1DCD9F]/10'
                    : 'border-[#333333] bg-[#1A1A1A]'
                } rounded-md cursor-pointer transition-all duration-200`}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full mb-1"
                />
                <span className="text-white text-xs text-center truncate w-full">{member.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2 flex items-center">
            <Tag size={16} className="mr-2 text-[#1DCD9F]" />
            Labels
          </label>
          <div className="flex flex-wrap gap-2">
            {availableLabels.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => toggleLabel(label)}
                className={`px-3 py-1 rounded-full text-xs ${
                  formData.labels.includes(label)
                    ? 'bg-[#1DCD9F] text-black'
                    : 'bg-[#333333] text-white/80 hover:bg-[#444444]'
                } transition-colors duration-200`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddTaskModal;
