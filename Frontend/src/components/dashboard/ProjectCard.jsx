import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';

/**
 * @typedef {Object} Member
 * @property {string} id
 * @property {string} name
 * @property {string} avatar
 */

/**
 * @typedef {Object} ProjectCardProps
 * @property {string} id
 * @property {string} _id
 * @property {string} title
 * @property {string} description
 * @property {number} progress
 * @property {Member[]} members
 * @property {string} createdAt
 * @property {string} dueDate
 * @property {number} [index=0]
 */

/**
 * Project card component
 * @param {ProjectCardProps} props
 */
const ProjectCard = ({
  id,
  _id,
  title,
  description,
  progress = 0,
  members = [],
  dueDate,
  index = 0
}) => {
  // Ensure we have a valid project ID
  const projectId = id || _id;
  
  // Ensure members is always an array
  const membersList = Array.isArray(members) ? members : [];
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * (index) }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-[#222222] rounded-lg overflow-hidden border border-[#333333] hover:border-[#1DCD9F]/50 transition-all duration-300"
    >
      <Link to={`/projects/${projectId}`} className="block h-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <div className="bg-[#1DCD9F]/20 text-[#1DCD9F] text-xs font-medium px-2.5 py-1 rounded">
              {progress}% Complete
            </div>
          </div>
          
          <p className="text-white/70 mb-6 line-clamp-2">{description}</p>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-white/60 text-sm">
              <Calendar size={16} className="mr-1" />
              <span>Due: {formatDate(dueDate)}</span>
            </div>
            
            <div className="flex items-center text-white/60 text-sm">
              <Users size={16} className="mr-1" />
              <span>{membersList.length} members</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex -space-x-2">
              {membersList.length > 0 ? (
                <>
                  {membersList.slice(0, 3).map((member) => (
                    <img
                      key={member.id || member.userId || member._id || Math.random().toString()}
                      src={member.avatar || member.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'User')}&background=1A1A1A&color=FFFFFF`}
                      alt={member.name || 'Team member'}
                      className="w-8 h-8 rounded-full border-2 border-[#222222]"
                      title={member.name || 'Team member'}
                    />
                  ))}
                  {membersList.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-[#333333] border-2 border-[#222222] flex items-center justify-center text-xs text-white">
                      +{membersList.length - 3}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#333333] border-2 border-[#222222] flex items-center justify-center">
                  <Users size={14} className="text-white/70" />
                </div>
              )}
            </div>
            
            <div className="w-full max-w-[130px]">
              <div className="w-full bg-[#333333] rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.2 * (index) }}
                  className="bg-[#1DCD9F] h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
