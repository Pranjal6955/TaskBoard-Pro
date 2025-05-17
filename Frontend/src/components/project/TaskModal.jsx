import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Calendar, Tag, AlertCircle, Clock, MessageSquare, Edit, Trash2, Send } from 'lucide-react';
import { updateTask, deleteTask } from '../../services/taskService';
import { getTaskComments, createComment } from '../../services/commentService';

const TaskModal = ({ isOpen, onClose, task, onTaskUpdate, onTaskDelete }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task || {});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Update editedTask when task changes
  useEffect(() => {
    if (task) {
      console.log("Task in modal:", task); // Debug log to check task data
      console.log("Labels in task:", task.labels); // Debug log specifically for labels
      
      setEditedTask({
        ...task,
        labels: task.labels || [] // Ensure labels is at least an empty array
      });
      
      // Reset error when task changes
      setError(null);
      
      // Reset comment form when task changes
      setNewComment('');
      
      // Fetch comments when task changes and comments tab is active
      if (activeTab === 'comments') {
        fetchComments();
      }
    }
  }, [task]);

  // Fetch comments when switching to comments tab
  useEffect(() => {
    if (isOpen && activeTab === 'comments' && task) {
      fetchComments();
    }
  }, [activeTab, isOpen, task]);

  const fetchComments = async () => {
    if (!task || !task._id) return;
    
    try {
      setCommentLoading(true);
      const fetchedComments = await getTaskComments(task._id);
      setComments(fetchedComments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      // Don't show error for comments, just log it
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  const handleSaveChanges = async () => {
    if (!editedTask._id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Ensure labels is at least an empty array before saving
      const taskToSave = {
        ...editedTask,
        labels: editedTask.labels || []
      };
      
      console.log("Saving task with data:", taskToSave); // Debug log
      console.log("Labels being saved:", taskToSave.labels); // Debug labels specifically
      
      const updatedTask = await updateTask(editedTask._id, taskToSave);
      
      console.log("Task updated:", updatedTask); // Debug log
      console.log("Labels in updated task:", updatedTask.labels); // Debug updated labels
      
      // Update the editedTask with the response from the server
      setEditedTask(updatedTask);
      
      // Notify parent component about the update
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask._id || updatedTask.id, updatedTask);
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTask = async () => {
    if (!task || !task._id) return;
    
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Make sure we're using the correct task ID
      const taskId = task._id || task.id;
      console.log("Attempting to delete task with ID:", taskId);
      
      // Check if the task ID is valid
      if (!taskId) {
        throw new Error("Invalid task ID");
      }
      
      await deleteTask(taskId);
      
      // Close modal and notify parent regardless of API result
      onClose();
      if (onTaskDelete) {
        onTaskDelete(taskId);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      
      // Don't show any error for deletion issues
      // Just close the modal and let the parent component handle it
      onClose();
      if (onTaskDelete) {
        onTaskDelete(task._id || task.id);
      }
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !task || !task._id) return;
    
    try {
      setCommentLoading(true);
      
      const commentData = {
        taskId: task._id,
        content: newComment.trim()
      };
      
      const createdComment = await createComment(commentData);
      
      // Add the new comment to the list
      setComments(prev => [...prev, createdComment]);
      
      // Clear the comment form
      setNewComment('');
    } catch (err) {
      console.error('Error creating comment:', err);
      // Don't show error for comments, just log it
    } finally {
      setCommentLoading(false);
    }
  };
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
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
      <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={handleSaveChanges}
        loading={isLoading}
      >
        Save Changes
      </Button>
    </div>
  ) : (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        className="text-red-500 border-red-500/30 hover:bg-red-500/10"
        icon={<Trash2 size={16} />}
        onClick={handleDeleteTask}
        loading={isLoading}
      >
        Delete
      </Button>
      <Button 
        variant="primary" 
        onClick={() => setIsEditing(true)}
        icon={<Edit size={16} />}
        disabled={isLoading}
      >
        Edit Task
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Task" : (task?.title || 'Task Details')}
      footer={modalFooter}
      size="lg"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm flex items-center">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          {error}
        </div>
      )}
      
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
          Comments {comments.length > 0 ? `(${comments.length})` : ''}
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
                value={editedTask.title || ''}
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
                value={editedTask.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-white/80 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
                />
              </div>
            </div>
            
            {/* Labels editing section */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Labels
              </label>
              <div className="flex flex-wrap gap-2 border border-[#333333] rounded-md p-3 bg-[#1A1A1A]">
                {['design', 'development', 'marketing', 'research', 'testing', 'planning', 'ui/ux', 'backend', 'frontend'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const labels = editedTask.labels || [];
                      const newLabels = labels.includes(label)
                        ? labels.filter(l => l !== label)
                        : [...labels, label];
                      setEditedTask(prev => ({ ...prev, labels: newLabels }));
                    }}
                    className={`px-3 py-1 rounded-full text-xs ${
                      (editedTask.labels || []).includes(label)
                        ? 'bg-[#1DCD9F] text-black'
                        : 'bg-[#333333] text-white/80 hover:bg-[#444444]'
                    } transition-colors duration-200`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center text-white/60 text-sm">
                <Clock size={14} className="mr-1" />
                Due {formatDate(task?.dueDate)}
              </div>
            </div>
            
            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
              {task?.description || 'No description provided'}
            </p>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium text-white/80 mb-2">Labels</h4>
              <div className="flex flex-wrap gap-2">
                {console.log("Rendering labels:", editedTask?.labels)}
                {Array.isArray(editedTask?.labels) && editedTask.labels.length > 0 ? (
                  editedTask.labels.map((label, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#1DCD9F]/20 text-[#1DCD9F]"
                    >
                      <Tag size={10} className="mr-1" />
                      {label}
                    </span>
                  ))
                ) : (
                  <span className="text-white/50 text-sm">No labels</span>
                )}
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium text-white/80 mb-2">Assigned To</h4>
              {task?.assignee ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={task.assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee.name || task.assignee.email || 'User')}&background=1A1A1A&color=FFFFFF`}
                    alt={task.assignee.name || task.assignee.email || 'Assignee'}
                    className="w-10 h-10 rounded-full border-2 border-[#333333]"
                  />
                  <div>
                    <div className="text-white font-medium">{task.assignee.name || task.assignee.email || 'Unknown User'}</div>
                    <div className="text-white/60 text-sm">Assignee</div>
                  </div>
                </div>
              ) : (
                <div className="text-white/50 text-sm">No assignee</div>
              )}
            </div>
            
            <div className="pt-2 border-t border-[#333333] mt-4">
              <h4 className="text-sm font-medium text-white/80 mb-2 mt-4">Created</h4>
              <div className="text-white/70 text-sm">
                {task?.createdAt ? formatTimestamp(task.createdAt) : 'Unknown'}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="space-y-4">
          {commentLoading && comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1DCD9F] mx-auto mb-3"></div>
              <p className="text-white/70">Loading comments...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex space-x-3">
                      <img
                        src={comment.author?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || 'User')}&background=1A1A1A&color=FFFFFF`}
                        alt={comment.author?.name || 'User'}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 bg-[#1A1A1A] rounded-lg p-3">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-white">{comment.author?.name || 'Unknown User'}</span>
                          <span className="text-white/50 text-xs">{formatTimestamp(comment.createdAt)}</span>
                        </div>
                        <p className="text-white/80 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-white/50">
                    No comments yet
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSubmitComment} className="flex space-x-3">
                <img
                  src="https://ui-avatars.com/api/?name=You&background=1A1A1A&color=FFFFFF"
                  alt="Current User"
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition resize-none"
                    rows={2}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button 
                      variant="primary" 
                      size="sm"
                      type="submit"
                      icon={<Send size={14} />}
                      disabled={!newComment.trim()}
                      loading={commentLoading}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default TaskModal;
