import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Calendar, Tag, AlertCircle, User } from 'lucide-react';

const AddTaskModal = ({
  isOpen,
  onClose,
  onTaskCreated,
  columnType,
  teamMembers = [] // Add this prop with default empty array
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assigneeId: '',
    labels: []
  });
  
  // Add this effect to update assigneeId when teamMembers changes
  useEffect(() => {
    if (teamMembers && teamMembers.length > 0) {
      setFormData(prev => ({
        ...prev,
        assigneeId: prev.assigneeId || teamMembers[0].id || teamMembers[0].userId || ''
      }));
    }
  }, [teamMembers]);

  const [isLoading, setIsLoading] = useState(false);
  
  // Debug log to check what's coming in
  useEffect(() => {
    console.log("TeamMembers in AddTaskModal:", teamMembers);
  }, [teamMembers]);

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
      const assignee = teamMembers.find(member => 
        member.id === formData.assigneeId || member.userId === formData.assigneeId
      );
      
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
        assigneeId: teamMembers.length > 0 ? teamMembers[0].id || teamMembers[0].userId : '',
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
          
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id || member.userId}
                  onClick={() => setFormData(prev => ({ ...prev, assigneeId: member.id || member.userId }))}
                  className={`flex flex-col items-center p-2 border ${
                    formData.assigneeId === (member.id || member.userId)
                      ? 'border-[#1DCD9F] bg-[#1DCD9F]/10'
                      : 'border-[#333333] bg-[#1A1A1A]'
                  } rounded-md cursor-pointer transition-all duration-200`}
                >
                  <img
                    src={member.avatar || member.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || member.email)}&background=1A1A1A&color=FFFFFF`}
                    alt={member.name || member.email}
                    className="w-10 h-10 rounded-full mb-1"
                  />
                  <span className="text-white text-xs text-center truncate w-full">{member.name || member.email}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-[#1A1A1A] border border-[#333333] rounded-md">
              <User size={20} className="mx-auto text-white/40 mb-2" />
              <p className="text-white/70">No team members available for assignment.</p>
              <p className="text-white/50 text-xs mt-1">Invite members to your project first.</p>
            </div>
          )}
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
