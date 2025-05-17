import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

const ProjectSettingsModal = ({ isOpen, onClose, project, onProjectUpdate, onProjectDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    tags: []
  });
  
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project && isOpen) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '',
        tags: project.tags || []
      });
    }
  }, [project, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format data for API
      const updatedProject = {
        ...project,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || null,
        tags: formData.tags
      };
      
      await onProjectUpdate(updatedProject);
      onClose();
    } catch (error) {
      console.error('Failed to update project:', error);
      setErrors({ submit: 'Failed to update project. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onProjectDelete(project._id || project.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete project:', error);
      setErrors({ submit: 'Failed to delete project. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setConfirmDelete(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#222222] rounded-lg w-full max-w-lg mx-4 shadow-xl border border-[#333333]"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#333333]">
            <h2 className="text-xl font-bold text-white">Project Settings</h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label htmlFor="title" className="block text-white/70 mb-1">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full bg-[#333333] border ${errors.title ? 'border-red-500' : 'border-[#444444]'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-white/70 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full bg-[#333333] border border-[#444444] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label htmlFor="dueDate" className="block text-white/70 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full bg-[#333333] border border-[#444444] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]"
              />
            </div>
            
            {errors.submit && (
              <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500 text-red-200">
                {errors.submit}
              </div>
            )}
            
            <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 sm:justify-between">
              <div>
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleDelete}
                  loading={isSubmitting && confirmDelete}
                  className={confirmDelete ? 'animate-pulse' : ''}
                  icon={confirmDelete ? <AlertTriangle size={16} /> : <Trash size={16} />}
                >
                  {confirmDelete ? 'Confirm Delete' : 'Delete Project'}
                </Button>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting && !confirmDelete}
                  icon={<Save size={16} />}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProjectSettingsModal;
