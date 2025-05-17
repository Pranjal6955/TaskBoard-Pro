import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Calendar, Tag, AlertCircle, User, PlusCircle } from 'lucide-react';

const AddTaskModal = ({
  isOpen,
  onClose,
  onTaskCreated,
  columnType,
  teamMembers = [],
  isLoading
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',  // Set default priority to medium
    dueDate: '',
    assigneeId: '',
    labels: [],
    status: columnTypeToStatus(columnType)
  });
  
  const [validationError, setValidationError] = useState(null);
  const [isAddingCustomStatus, setIsAddingCustomStatus] = useState(false);
  const [customStatus, setCustomStatus] = useState('');
  
  function columnTypeToStatus(type) {
    const statusMap = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'done': 'Done'
    };
    return statusMap[type] || 'To Do';
  }
  
  useEffect(() => {
    if (teamMembers && teamMembers.length > 0) {
      setFormData(prev => ({
        ...prev,
        assigneeId: prev.assigneeId || teamMembers[0].id || teamMembers[0].userId || ''
      }));
    } else {
      // Reset assigneeId if no team members are available
      setFormData(prev => ({
        ...prev,
        assigneeId: ''
      }));
    }
  }, [teamMembers]);

  // Log team members for debugging
  useEffect(() => {
    console.log("TeamMembers in AddTaskModal:", teamMembers);
  }, [teamMembers]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      status: columnTypeToStatus(columnType)
    }));
  }, [columnType]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',  // Set default priority to medium
        dueDate: '',
        assigneeId: teamMembers.length > 0 ? teamMembers[0].id || teamMembers[0].userId : '',
        labels: [],
        status: columnTypeToStatus(columnType)
      });
    }
  }, [isOpen, columnType, teamMembers]);

  const availableLabels = [
    'design', 'development', 'marketing', 'research', 'testing', 'planning', 'ui/ux', 'backend', 'frontend'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`); // Debug log
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError(null); // Clear validation errors on change
  };
  
  const toggleLabel = (label) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label]
    }));
    console.log("Updated labels:", formData.labels); // Debug log for labels
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.title) {
      setValidationError("Title is required");
      return;
    }
    
    if (!formData.description) {
      setValidationError("Description is required");
      return;
    }
    
    if (!formData.dueDate) {
      setValidationError("Due date is required");
      return;
    }
    
    if (!formData.priority) {
      setValidationError("Please select a priority");
      return;
    }

    // Validate assignee if team members exist
    if (teamMembers.length > 0 && !formData.assigneeId) {
      setValidationError("Please select an assignee");
      return;
    }
    
    // Find the selected assignee from team members
    const assignee = teamMembers.find(member => 
      (member.id === formData.assigneeId) || 
      (member.userId === formData.assigneeId)
    );
    
    if (!assignee && teamMembers.length > 0) {
      setValidationError("Selected assignee is not a team member");
      return;
    }
    
    // Prepare the task data for creation
    const taskData = {
      ...formData,
      status: columnTypeToStatus(columnType)
    };

    // Debug log to verify the priority being sent
    console.log("Creating task with priority:", taskData.priority);
    console.log("Creating task with labels:", taskData.labels);

    // Only add assignee data if an assignee was selected
    if (assignee) {
      // Instead of embedding full assignee object, just send the email
      // The backend expects an email and will handle the rest
      taskData.assignee = assignee.email;
    }
    
    onTaskCreated(taskData);
    
    // Don't reset the form here, we'll do it when the modal opens
    setValidationError(null);
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
      {validationError && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm flex items-center">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          {validationError}
        </div>
      )}
      
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
            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center">
              <AlertCircle size={16} className="mr-2 text-[#1DCD9F]" />
              Priority
            </label>
            
            {/* Improved priority buttons layout with required selection */}
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => {
                  const newPriority = 'low';
                  console.log(`Setting priority to ${newPriority}`);
                  setFormData(prev => ({ ...prev, priority: newPriority }));
                }}
                className={`py-2 rounded-md flex items-center justify-center transition-all text-xs sm:text-sm ${
                  formData.priority === 'low' 
                    ? 'bg-blue-500/30 border border-blue-500 text-blue-300' 
                    : 'bg-[#1A1A1A] border border-[#333333] text-white/70 hover:bg-[#1A1A1A]/80'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
                Low
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const newPriority = 'medium';
                  console.log(`Setting priority to ${newPriority}`);
                  setFormData(prev => ({ ...prev, priority: newPriority }));
                }}
                className={`py-2 rounded-md flex items-center justify-center transition-all text-xs sm:text-sm ${
                  formData.priority === 'medium' 
                    ? 'bg-yellow-500/30 border border-yellow-500 text-yellow-300' 
                    : 'bg-[#1A1A1A] border border-[#333333] text-white/70 hover:bg-[#1A1A1A]/80'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span>
                Medium
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const newPriority = 'high';
                  console.log(`Setting priority to ${newPriority}`);
                  setFormData(prev => ({ ...prev, priority: newPriority }));
                }}
                className={`py-2 rounded-md flex items-center justify-center transition-all text-xs sm:text-sm ${
                  formData.priority === 'high' 
                    ? 'bg-red-500/30 border border-red-500 text-red-300' 
                    : 'bg-[#1A1A1A] border border-[#333333] text-white/70 hover:bg-[#1A1A1A]/80'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                High
              </button>
            </div>
            
            {/* Show the current priority selection for confirmation */}
            <div className="mt-2 text-xs text-white/70">
              Selected priority: <span className="font-medium text-white">{formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}</span>
            </div>
            
            {/* Hidden input to store priority value */}
            <input type="hidden" name="priority" value={formData.priority} />
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
                  key={member.id || member.userId || member.email}
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    assigneeId: member.id || member.userId 
                  }))}
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
                  <span className="text-white text-xs text-center truncate w-full">
                    {member.name || member.email}
                  </span>
                  <span className="text-white/50 text-xs text-center truncate w-full">
                    {member.role || 'Member'}
                  </span>
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
          
          {/* Display selected labels */}
          {formData.labels.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-white/70 mb-1">Selected labels:</p>
              <div className="flex flex-wrap gap-1">
                {formData.labels.map(label => (
                  <span key={label} className="bg-[#1DCD9F]/20 text-[#1DCD9F] text-xs px-2 py-1 rounded-full">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Modified status selection with custom status option */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-white/80 mb-2">
            Status
          </label>
          
          {!isAddingCustomStatus ? (
            <div className="flex flex-col space-y-2">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                {/* Show any existing custom status that's not in the default options */}
                {!["To Do", "In Progress", "Done"].includes(formData.status) && (
                  <option value={formData.status}>{formData.status}</option>
                )}
              </select>
              
              <button
                type="button"
                onClick={() => setIsAddingCustomStatus(true)}
                className="text-[#1DCD9F] text-sm hover:underline flex items-center"
              >
                <PlusCircle size={14} className="mr-1" />
                Add custom status
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customStatus}
                  onChange={(e) => setCustomStatus(e.target.value)}
                  placeholder="Enter custom status"
                  className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
                />
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => {
                    if (customStatus.trim()) {
                      setFormData(prev => ({ ...prev, status: customStatus.trim() }));
                      setIsAddingCustomStatus(false);
                      setCustomStatus('');
                    }
                  }}
                  disabled={!customStatus.trim()}
                >
                  Add
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsAddingCustomStatus(false);
                    setCustomStatus('');
                  }}
                >
                  Cancel
                </Button>
              </div>
              <p className="text-white/50 text-xs">
                Custom status will be available only for this task.
              </p>
            </div>
          )}
          
          {/* Show the current status */}
          <div className="mt-2">
            <span className="text-sm text-white/70">Current status: </span>
            <span className="text-sm font-medium text-[#1DCD9F]">{formData.status}</span>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddTaskModal;
