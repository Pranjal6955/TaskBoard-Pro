import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

/**
 * @typedef {Object} Rule
 * @property {string} id - The rule's unique identifier
 * @property {string} name - The name of the rule
 * @property {Object} condition - The condition that triggers the rule
 * @property {string} condition.type - Type of condition (priority, status, label)
 * @property {string} condition.value - Value for the condition
 * @property {Object} action - The action to perform when condition is met
 * @property {string} action.type - Type of action (assign, move, label)
 * @property {string|Object} action.value - Value for the action
 */

/**
 * Component to display a preview of an automation rule
 * 
 * @param {Object} props
 * @param {Rule} props.rule - The rule to display
 * @param {Function} props.onDeleteRule - Callback when delete button is clicked
 */
const RulePreview = ({ rule, onDeleteRule }) => {
  // Format the condition text
  const formatCondition = () => {
    let typeText = '';
    let valueText = '';
    
    switch (rule.condition.type) {
      case 'priority':
        typeText = 'Task priority';
        valueText = rule.condition.value;
        break;
      case 'status':
        typeText = 'Task status';
        valueText = rule.condition.value;
        break;
      case 'label':
        typeText = 'Task has label';
        valueText = rule.condition.value;
        break;
      default:
        typeText = rule.condition.type;
        valueText = rule.condition.value;
    }
    
    return { typeText, valueText };
  };
  
  // Format the action text
  const formatAction = () => {
    let typeText = '';
    let valueText = '';
    
    switch (rule.action.type) {
      case 'assign':
        typeText = 'Assign task to';
        valueText = typeof rule.action.value === 'object' 
          ? rule.action.value.name 
          : rule.action.value;
        break;
      case 'move':
        typeText = 'Move task to';
        valueText = rule.action.value === 'todo' 
          ? 'To Do' 
          : rule.action.value === 'in-progress'
            ? 'In Progress'
            : 'Done';
        break;
      case 'label':
        typeText = 'Add label';
        valueText = rule.action.value;
        break;
      default:
        typeText = rule.action.type;
        valueText = rule.action.value;
    }
    
    return { typeText, valueText };
  };
  
  const condition = formatCondition();
  const action = formatAction();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-4 mb-4"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white font-medium">{rule.name}</h3>
        <Button 
          variant="text" 
          className="text-red-400 hover:bg-red-500/10 p-1"
          onClick={() => onDeleteRule(rule.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="bg-[#222222] rounded px-3 py-2 mb-2 md:mb-0">
          <p className="text-white/70 text-sm">
            <span className="font-medium text-white">When</span> {condition.typeText} is{' '}
            <span className="text-[#1DCD9F]">{condition.valueText}</span>
          </p>
        </div>
        
        <ArrowRight size={16} className="text-white/50 hidden md:block" />
        
        <div className="bg-[#222222] rounded px-3 py-2">
          <p className="text-white/70 text-sm">
            <span className="font-medium text-white">Then</span> {action.typeText}{' '}
            <span className="text-[#1DCD9F]">{action.valueText}</span>
          </p>
        </div>
      </div>
      
      {rule.id === 'r2' && (
        <div className="flex items-center mt-3 text-yellow-400 text-xs">
          <AlertTriangle size={14} className="mr-1" />
          This rule requires additional testing
        </div>
      )}
    </motion.div>
  );
};

export default RulePreview;