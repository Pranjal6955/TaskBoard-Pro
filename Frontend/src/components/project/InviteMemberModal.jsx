import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Search, Mail, AlertCircle, Check, X, User } from 'lucide-react';
import { getUsersByEmail } from '../../services/userService';
import { inviteUserToProject, removeUserFromProject } from '../../services/projectService';

const InviteMemberModal = ({ isOpen, onClose, projectId, currentMembers = [], onMembersUpdated }) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Initialize members from currentMembers prop
  useEffect(() => {
    if (currentMembers && currentMembers.length > 0) {
      setMembers(currentMembers);
    }
  }, [currentMembers]);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchEmail.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const result = await getUsersByEmail(searchEmail);
      
      // Filter out users who are already members
      const filteredResults = Array.isArray(result) ? result.filter(user => {
        return !members.some(member => 
          (member.email === user.email) || 
          (member.userId === user.uid) || 
          (member.id === user.id)
        );
      }) : [];
      
      setSearchResults(filteredResults);
      setSearchPerformed(true);
    } catch (err) {
      console.error("Error searching for users:", err);
      setError("Failed to search for users. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (email) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await inviteUserToProject(projectId, email);
      
      setSuccessMessage(`Successfully invited ${email} to the project!`);
      // Clear search results and input
      setSearchEmail('');
      setSearchResults([]);
      setSearchPerformed(false);
      
      // Update members list with the new member
      if (result.project && result.project.members) {
        const updatedMembers = result.project.members.map(member => ({
          id: member.userId,
          userId: member.userId,
          email: member.email,
          name: member.name || member.email.split('@')[0],
          avatar: member.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.email)}&background=1A1A1A&color=FFFFFF`,
          role: member.role
        }));
        
        setMembers(updatedMembers);
        
        // Notify parent component about the updated members
        if (onMembersUpdated) {
          onMembersUpdated(updatedMembers);
        }
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error inviting user:", err);
      setError(err.response?.data?.message || "Failed to invite user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      setIsLoading(true);
      setError(null);
      await removeUserFromProject(projectId, userId);
      
      // Update the members list
      const updatedMembers = members.filter(member => 
        (member.userId !== userId) && (member.id !== userId)
      );
      setMembers(updatedMembers);
      
      // Notify parent component
      if (onMembersUpdated) {
        onMembersUpdated(updatedMembers);
      }
      
      setSuccessMessage("Team member removed successfully.");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error removing team member:", err);
      setError("Failed to remove team member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Team Members"
      footer={modalFooter}
      size="lg"
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 flex items-center gap-2 text-sm">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-red-200">{error}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-md p-3 flex items-center gap-2 text-sm">
            <Check size={16} className="text-green-500" />
            <span className="text-green-200">{successMessage}</span>
          </div>
        )}
      
        <div>
          <h3 className="text-lg font-medium mb-4">Invite Team Members</h3>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
              <input
                type="email"
                placeholder="Search by email address..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
              />
            </div>
            <Button 
              variant="primary" 
              type="submit"
              loading={isLoading}
            >
              Search
            </Button>
          </form>
          
          {searchPerformed && (
            <div className="mt-4">
              {searchResults.length === 0 ? (
                <div className="text-center p-4 bg-[#1A1A1A] border border-[#333333] rounded-md">
                  <p className="text-white/70">No users found with that email.</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={() => handleInvite(searchEmail)}
                  >
                    <Mail size={14} className="mr-1" />
                    Invite {searchEmail}
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-[#333333] border border-[#333333] rounded-md overflow-hidden">
                  {searchResults.map((user) => (
                    <li key={user.uid || user.id} className="flex justify-between items-center p-3 bg-[#1A1A1A]">
                      <div className="flex items-center">
                        <img 
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1A1A1A&color=FFFFFF`} 
                          alt={user.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-white/60">{user.email}</p>
                        </div>
                      </div>
                      
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleInvite(user.email)}
                        disabled={isLoading}
                      >
                        <Mail size={14} className="mr-1" />
                        Invite
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Current Team Members</h3>
          {members && members.length > 0 ? (
            <ul className="divide-y divide-[#333333] border border-[#333333] rounded-md overflow-hidden">
              {members.map((member) => (
                <motion.li
                  key={member.id || member.userId || member.email}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-between items-center p-3 bg-[#1A1A1A]"
                >
                  <div className="flex items-center">
                    <img 
                      src={member.avatar || member.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || member.email)}&background=1A1A1A&color=FFFFFF`} 
                      alt={member.name || member.email}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{member.name || member.email}</p>
                      <p className="text-sm text-white/60">
                        {member.email} 
                        {member.role === 'owner' && (
                          <span className="ml-2 bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-xs">
                            Owner
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {member.role !== 'owner' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                      onClick={() => handleRemoveMember(member.userId || member.id)}
                      disabled={isLoading}
                    >
                      <X size={14} className="mr-1" />
                      Remove
                    </Button>
                  )}
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-6 bg-[#1A1A1A] border border-[#333333] rounded-md">
              <User size={24} className="mx-auto text-white/40 mb-2" />
              <p className="text-white/70">No team members added yet.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default InviteMemberModal;
