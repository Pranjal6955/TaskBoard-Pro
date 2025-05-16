import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Calendar, Tag, AlertCircle, Clock, MessageSquare, Edit, Trash2 } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, task }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  
  const priorityColors = {
    high: 'bg-red-500 text-white',
    medium: 'bg-yellow-500 text-black',
    low: 'bg-blue-500 text-white'
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  const handleSaveChanges = () => {
    // In a real app, this would update the task in the backend
    setIsEditing(false);
    // For demo purposes, we're not actually saving changes
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };
  
  // Mock comments for demo
  const comments = [
    {
      id: 'c1',
      user: { name: 'Maya Patel', avatar: 'https://i.pravatar.cc/150?img=5' },
      content: 'I\'ve started researching this. Will update with findings by tomorrow.',
      timestamp: '2023-11-02T14:32:00Z'
    },
    {
      id: 'c2',
      user: { name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
      content: 'Great! Let me know if you need any resources or have questions.',
      timestamp: '2023-11-02T15:45:00Z'
    }
  ];
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit'
    });
  };
  
  const modalFooter = isEditing ? (
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={() => setIsEditing(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSaveChanges}>
        Save Changes
      </Button>
    </div>
  ) : (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        className="text-red-500 border-red-500/30 hover:bg-red-500/10"
        icon={<Trash2 size={16} />}
      >
        Delete
      </Button>
      <Button 
        variant="primary" 
        onClick={() => setIsEditing(true)}
        icon={<Edit size={16} />}
      >
        Edit Task
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Task" : task.title}
      footer={modalFooter}
      size="lg"
    >
      <div className="flex border-b border-[#333333] mb-4">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'text-[#1DCD9F] border-b-2 border-[#1DCD9F]' : 'text-white/70'}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'comments' ? 'text-[#1DCD9F] border-b-2 border-[#1DCD9F]' : 'text-white/70'}`}
          onClick={() => setActiveTab('comments')}
        >
          Comments ({comments.length})
        </button>
      </div>
      
      {activeTab === 'details' ? (
        isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-2">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-white/80 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={editedTask.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-white/80 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={editedTask.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
              
              <div className="flex items-center text-white/60 text-sm">
                <Clock size={14} className="mr-1" />
                Due {formatDate(task.dueDate)}
              </div>
            </div>
            
            <p className="text-white/80 leading-relaxed">
              {task.description}
            </p>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium text-white/80 mb-2">Labels</h4>
              <div className="flex flex-wrap gap-2">
                {task.labels.map((label, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#1DCD9F]/20 text-[#1DCD9F]"
                  >
                    <Tag size={10} className="mr-1" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium text-white/80 mb-2">Assigned To</h4>
              <div className="flex items-center space-x-3">
                <img
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                  className="w-10 h-10 rounded-full border-2 border-[#333333]"
                />
                <div>
                  <div className="text-white font-medium">{task.assignee.name}</div>
                  <div className="text-white/60 text-sm">Assignee</div>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="space-y-4">
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="flex-1 bg-[#1A1A1A] rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-white">{comment.user.name}</span>
                    <span className="text-white/50 text-xs">{formatTimestamp(comment.timestamp)}</span>
                  </div>
                  <p className="text-white/80">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-3">
            <img
              src="https://i.pravatar.cc/150?img=1"
              alt="Current User"
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                placeholder="Add a comment..."
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition resize-none"
                rows={2}
              />
              <div className="mt-2 flex justify-end">
                <Button 
                  variant="primary" 
                  size="sm"
                  icon={<MessageSquare size={14} />}
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TaskModal;
