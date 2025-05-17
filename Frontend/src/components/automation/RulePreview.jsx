import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, Trash2, Zap, Bell, Tag, ArrowRight as MoveIcon } from 'lucide-react';
import Button from '../ui/Button';
import PropTypes from 'prop-types';

const RulePreview = ({ rule, onDeleteRule }) => {
  const getTriggerDisplay = () => {
    let triggerType = '';
    let triggerDetails = '';
    
    switch (rule.trigger.type) {
      case 'STATUS_CHANGE':
        triggerType = 'Task status changes';
        triggerDetails = `from "${rule.trigger.fromStatus}" to "${rule.trigger.toStatus}"`;
        break;
      case 'ASSIGNMENT_CHANGE':
        triggerType = 'Task is assigned';
        triggerDetails = rule.trigger.assigneeEmail ? 
          `to ${rule.trigger.assigneeEmail}` : 'to someone';
        break;
      case 'DUE_DATE_PASSED':
        triggerType = 'Task due date passes';
        triggerDetails = '';
        break;
      default:
        triggerType = rule.trigger.type;
        triggerDetails = '';
    }
    
    return { triggerType, triggerDetails };
  };
  
  const getActionDisplay = () => {
    let actionType = '';
    let actionDetails = '';
    let actionIcon = <Zap size={14} className="mr-1 text-[#1DCD9F]" />;
    
    switch (rule.action.type) {
      case 'ASSIGN_BADGE':
        actionType = 'Assign badge';
        actionDetails = rule.action.badgeName || 'to user';
        actionIcon = <Tag size={14} className="mr-1 text-[#1DCD9F]" />;
        break;
      case 'MOVE_TASK':
        actionType = 'Move task';
        actionDetails = `to "${rule.action.targetStatus}"`;
        actionIcon = <MoveIcon size={14} className="mr-1 text-[#1DCD9F]" />;
        break;
      case 'SEND_NOTIFICATION':
        actionType = 'Send notification';
        const recipients = [];
        if (rule.action.notifyAssignee) recipients.push('assignee');
        if (rule.action.notifyCreator) recipients.push('creator');
        if (rule.action.notifyProjectOwners) recipients.push('project owners');
        
        actionDetails = recipients.length > 0 ? 
          `to ${recipients.join(', ')}` : 
          rule.action.notificationText ? 
            `"${rule.action.notificationText.substring(0, 20)}${rule.action.notificationText.length > 20 ? '...' : ''}"` : 
            '';
        actionIcon = <Bell size={14} className="mr-1 text-[#1DCD9F]" />;
        break;
      default:
        actionType = rule.action.type;
        actionDetails = '';
    }
    
    return { actionType, actionDetails, actionIcon };
  };
  
  const { triggerType, triggerDetails } = getTriggerDisplay();
  const { actionType, actionDetails, actionIcon } = getActionDisplay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-4 mb-4"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white font-medium">{rule.name}</h3>
        <div className="flex items-center">
          {!rule.isActive && (
            <span className="text-yellow-400 text-xs mr-2 bg-yellow-400/10 rounded-full px-2 py-1 flex items-center">
              <AlertTriangle size={10} className="mr-1" />
              Disabled
            </span>
          )}
          <Button 
            variant="text" 
            className="text-red-400 hover:bg-red-500/10 p-1"
            onClick={() => onDeleteRule(rule._id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="bg-[#222222] rounded px-3 py-2 mb-2 md:mb-0">
          <p className="text-white/70 text-sm">
            <span className="font-medium text-white">When</span> {triggerType}{' '}
            {triggerDetails && (
              <span className="text-[#1DCD9F]">{triggerDetails}</span>
            )}
          </p>
        </div>
        
        <ArrowRight size={16} className="text-white/50 hidden md:block" />
        
        <div className="bg-[#222222] rounded px-3 py-2">
          <p className="text-white/70 text-sm flex items-center">
            <span className="font-medium text-white flex items-center">
              {actionIcon} {actionType}
            </span>{' '}
            {actionDetails && (
              <span className="text-[#1DCD9F] ml-1">{actionDetails}</span>
            )}
          </p>
        </div>
      </div>
      
      {rule.action.type === 'SEND_NOTIFICATION' && rule.action.notificationText && (
        <div className="mt-3 bg-[#222222] rounded px-3 py-2">
          <p className="text-xs text-white/70 italic">
            "{rule.action.notificationText}"
          </p>
        </div>
      )}
    </motion.div>
  );
};

RulePreview.propTypes = {
  rule: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string.isRequired,
    trigger: PropTypes.object.isRequired,
    action: PropTypes.object.isRequired,
    isActive: PropTypes.bool
  }).isRequired,
  onDeleteRule: PropTypes.func.isRequired
};

export default RulePreview;