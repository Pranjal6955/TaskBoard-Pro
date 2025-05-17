import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Zap, Plus } from 'lucide-react';

import PropTypes from 'prop-types';

const RuleCreationForm = ({
  onCreateRule
}) => {
  const [ruleName, setRuleName] = useState('');
  const [trigger, setTrigger] = useState({ 
    type: 'STATUS_CHANGE',
    fromStatus: 'To Do',
    toStatus: 'In Progress'
  });
  const [action, setAction] = useState({ 
    type: 'SEND_NOTIFICATION',
    notificationText: '',
    notifyAssignee: true,
    notifyCreator: false,
    notifyProjectOwners: false
  });
  
  const triggerTypes = [
    { 
      id: 'STATUS_CHANGE', 
      name: 'Task Status Changes',
      hasAdditionalFields: true 
    },
    { 
      id: 'ASSIGNMENT_CHANGE', 
      name: 'Task Assignment Changes',
      hasAdditionalFields: true 
    },
    { 
      id: 'DUE_DATE_PASSED', 
      name: 'Task Due Date Passes',
      hasAdditionalFields: false 
    }
  ];
  
  const actionTypes = [
    { 
      id: 'ASSIGN_BADGE', 
      name: 'Assign Badge',
      hasAdditionalFields: true 
    },
    { 
      id: 'MOVE_TASK', 
      name: 'Move Task',
      hasAdditionalFields: true 
    },
    { 
      id: 'SEND_NOTIFICATION', 
      name: 'Send Notification',
      hasAdditionalFields: true 
    }
  ];
  
  const statusOptions = ['To Do', 'In Progress', 'Review', 'Done'];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!ruleName) return;
    
    const newRule = {
      name: ruleName,
      trigger,
      action,
      isActive: true
    };
    
    onCreateRule(newRule);
    setRuleName('');
  };
  
  const handleTriggerTypeChange = (e) => {
    const type = e.target.value;
    
    let newTrigger = { type };
    
    // Add appropriate fields based on trigger type
    switch (type) {
      case 'STATUS_CHANGE':
        newTrigger = {
          ...newTrigger,
          fromStatus: 'To Do',
          toStatus: 'In Progress'
        };
        break;
      case 'ASSIGNMENT_CHANGE':
        newTrigger = {
          ...newTrigger,
          assigneeEmail: ''
        };
        break;
      case 'DUE_DATE_PASSED':
        // No additional fields needed
        break;
      default:
        break;
    }
    
    setTrigger(newTrigger);
  };
  
  const handleActionTypeChange = (e) => {
    const type = e.target.value;
    
    let newAction = { type };
    
    // Add appropriate fields based on action type
    switch (type) {
      case 'ASSIGN_BADGE':
        newAction = {
          ...newAction,
          badgeName: 'Achiever'
        };
        break;
      case 'MOVE_TASK':
        newAction = {
          ...newAction,
          targetStatus: 'Done'
        };
        break;
      case 'SEND_NOTIFICATION':
        newAction = {
          ...newAction,
          notificationText: '',
          notifyAssignee: true,
          notifyCreator: false,
          notifyProjectOwners: false
        };
        break;
      default:
        break;
    }
    
    setAction(newAction);
  };
  
  const renderTriggerFields = () => {
    switch (trigger.type) {
      case 'STATUS_CHANGE':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">From Status</label>
              <select
                value={trigger.fromStatus || ''}
                onChange={(e) => setTrigger({...trigger, fromStatus: e.target.value})}
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">To Status</label>
              <select
                value={trigger.toStatus || ''}
                onChange={(e) => setTrigger({...trigger, toStatus: e.target.value})}
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 'ASSIGNMENT_CHANGE':
        return (
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Assignee Email</label>
            <input
              type="email"
              value={trigger.assigneeEmail || ''}
              onChange={(e) => setTrigger({...trigger, assigneeEmail: e.target.value})}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
              placeholder="example@email.com"
            />
          </div>
        );
      case 'DUE_DATE_PASSED':
        return (
          <div className="text-white/70 text-sm py-2">
            This trigger will activate when a task's due date passes.
          </div>
        );
      default:
        return null;
    }
  };
  
  const renderActionFields = () => {
    switch (action.type) {
      case 'ASSIGN_BADGE':
        return (
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Badge Name</label>
            <input
              type="text"
              value={action.badgeName || ''}
              onChange={(e) => setAction({...action, badgeName: e.target.value})}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
              placeholder="e.g., Achiever, Fast Completer"
            />
          </div>
        );
      case 'MOVE_TASK':
        return (
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Target Status</label>
            <select
              value={action.targetStatus || ''}
              onChange={(e) => setAction({...action, targetStatus: e.target.value})}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        );
      case 'SEND_NOTIFICATION':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Notification Message</label>
              <textarea
                value={action.notificationText || ''}
                onChange={(e) => setAction({...action, notificationText: e.target.value})}
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
                placeholder="Enter notification message"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Notify</label>
              <div className="space-y-1">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyAssignee"
                    checked={action.notifyAssignee}
                    onChange={(e) => setAction({...action, notifyAssignee: e.target.checked})}
                    className="mr-2 rounded bg-[#1A1A1A] border-[#333333] text-[#1DCD9F] focus:ring-[#1DCD9F]/50"
                  />
                  <label htmlFor="notifyAssignee" className="text-sm text-white/80">Task Assignee</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyCreator"
                    checked={action.notifyCreator}
                    onChange={(e) => setAction({...action, notifyCreator: e.target.checked})}
                    className="mr-2 rounded bg-[#1A1A1A] border-[#333333] text-[#1DCD9F] focus:ring-[#1DCD9F]/50"
                  />
                  <label htmlFor="notifyCreator" className="text-sm text-white/80">Task Creator</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyProjectOwners"
                    checked={action.notifyProjectOwners}
                    onChange={(e) => setAction({...action, notifyProjectOwners: e.target.checked})}
                    className="mr-2 rounded bg-[#1A1A1A] border-[#333333] text-[#1DCD9F] focus:ring-[#1DCD9F]/50"
                  />
                  <label htmlFor="notifyProjectOwners" className="text-sm text-white/80">Project Owners</label>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#222222] rounded-lg border border-[#333333] p-6"
    >
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
        <Zap size={18} className="text-[#1DCD9F] mr-2" />
        Create Automation Rule
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="ruleName" className="block text-sm font-medium text-white/80 mb-2">
            Rule Name
          </label>
          <input
            type="text"
            id="ruleName"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
            placeholder="E.g., Notify team when task is completed"
            required
          />
        </div>
        
        <div className="space-y-4">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-4">
            <h4 className="text-white text-md font-medium mb-3">Trigger (When)</h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="triggerType" className="block text-sm font-medium text-white/80 mb-2">
                  Trigger Type
                </label>
                <select
                  id="triggerType"
                  value={trigger.type}
                  onChange={handleTriggerTypeChange}
                  className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
                >
                  {triggerTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {renderTriggerFields()}
            </div>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-4">
            <h4 className="text-white text-md font-medium mb-3">Action (Then)</h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="actionType" className="block text-sm font-medium text-white/80 mb-2">
                  Action Type
                </label>
                <select
                  id="actionType"
                  value={action.type}
                  onChange={handleActionTypeChange}
                  className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
                >
                  {actionTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {renderActionFields()}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            type="submit" 
            icon={<Plus size={16} />}
            disabled={!ruleName}
          >
            Add Rule
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

RuleCreationForm.propTypes = {
  onCreateRule: PropTypes.func.isRequired,
};

export default RuleCreationForm;