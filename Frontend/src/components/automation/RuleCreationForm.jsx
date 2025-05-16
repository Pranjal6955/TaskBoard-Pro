import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Zap, Plus } from 'lucide-react';

import PropTypes from 'prop-types';

const RuleCreationForm = ({
  onCreateRule
}) => {
  const [ruleName, setRuleName] = useState('');
  const [condition, setCondition] = useState({ type: 'priority', value: 'high' });
  const [action, setAction] = useState({ type: 'assign', value: '1' });
  
  const conditionTypes = [
    { id: 'priority', name: 'Task Priority', values: ['high', 'medium', 'low'] },
    { id: 'status', name: 'Task Status', values: ['created', 'completed', 'overdue'] },
    { id: 'label', name: 'Task Label', values: ['design', 'development', 'marketing'] },
  ];
  
  const actionTypes = [
    { id: 'assign', name: 'Assign To', values: [
      { id: '1', name: 'Alex Johnson' },
      { id: '2', name: 'Maya Patel' },
      { id: '3', name: 'David Kim' }
    ]},
    { id: 'move', name: 'Move To Column', values: [
      { id: 'todo', name: 'To Do' },
      { id: 'in-progress', name: 'In Progress' },
      { id: 'done', name: 'Done' }
    ]},
    { id: 'label', name: 'Add Label', values: [
      { id: 'important', name: 'Important' },
      { id: 'blocked', name: 'Blocked' },
      { id: 'review', name: 'Needs Review' }
    ]}
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!ruleName) return;
    
    const newRule = {
      id: `rule-${Math.floor(Math.random() * 1000)}`,
      name: ruleName,
      condition,
      action
    };
    
    onCreateRule(newRule);
    setRuleName('');
  };
  
  const handleConditionTypeChange = (e) => {
    const type = e.target.value;
    const values = conditionTypes.find(c => c.id === type)?.values || [];
    setCondition({ type, value: values[0] });
  };
  
  const handleConditionValueChange = (e) => {
    setCondition(prev => ({ ...prev, value: e.target.value }));
  };
  
  const handleActionTypeChange = (e) => {
    const type = e.target.value;
    const values = actionTypes.find(a => a.id === type)?.values || [];
    setAction({ type, value: values[0].id });
  };
  
  const handleActionValueChange = (e) => {
    setAction(prev => ({ ...prev, value: e.target.value }));
  };
  
  const selectedConditionType = conditionTypes.find(c => c.id === condition.type);
  const selectedActionType = actionTypes.find(a => a.id === action.type);

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
            placeholder="E.g., Assign high priority tasks to Alex"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label htmlFor="conditionType" className="block text-sm font-medium text-white/80 mb-2">
              When
            </label>
            <select
              id="conditionType"
              value={condition.type}
              onChange={handleConditionTypeChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
            >
              {conditionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="conditionValue" className="block text-sm font-medium text-white/80 mb-2">
              Is
            </label>
            <select
              id="conditionValue"
              value={condition.value}
              onChange={handleConditionValueChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
            >
              {selectedConditionType?.values.map((value) => (
                <option key={value} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-center h-10">
            <div className="w-12 h-[2px] bg-[#333333] hidden md:block"></div>
          </div>
          
          <div>
            <label htmlFor="actionType" className="block text-sm font-medium text-white/80 mb-2">
              Then
            </label>
            <select
              id="actionType"
              value={action.type}
              onChange={handleActionTypeChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
            >
              {actionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="actionValue" className="block text-sm font-medium text-white/80 mb-2">
              Value
            </label>
            <select
              id="actionValue"
              value={action.value}
              onChange={handleActionValueChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]/50 focus:border-transparent transition"
            >
              {selectedActionType?.values.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-start-3 flex justify-end">
            <Button 
              variant="primary" 
              type="submit" 
              icon={<Plus size={16} />}
              disabled={!ruleName}
            >
              Add Rule
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

RuleCreationForm.propTypes = {
  onCreateRule: PropTypes.func.isRequired,
};

export default RuleCreationForm;