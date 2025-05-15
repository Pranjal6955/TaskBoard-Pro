const Automation = require('../models/Automation');
const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Function to process automations based on a trigger
exports.processAutomations = async (triggerType, task, user) => {
  try {
    // Find all active automations for this project and trigger type
    const automations = await Automation.find({
      projectId: task.projectId,
      triggerType,
      isActive: true
    });

    if (automations.length === 0) {
      return;
    }

    // Process each automation
    for (const automation of automations) {
      // Check if conditions match
      if (automation.condition && !await checkCondition(automation.condition, task)) {
        continue;
      }

      // Execute the action
      await executeAction(automation.action, task, user);
    }
  } catch (error) {
    console.error('Error processing automations:', error);
  }
};

// Check if the condition is met
const checkCondition = async (condition, task) => {
  if (!condition || !condition.field || !condition.operator) {
    return true; // No condition specified
  }

  let actualValue;

  // Get the actual value from the task based on field
  switch (condition.field) {
    case 'status':
      actualValue = task.status;
      break;
    case 'assignee':
      actualValue = task.assignee ? task.assignee.toString() : null;
      break;
    case 'dueDate':
      actualValue = task.dueDate;
      break;
    default:
      return false;
  }

  // Compare based on operator
  switch (condition.operator) {
    case 'equals':
      return actualValue === condition.value;
    case 'not_equals':
      return actualValue !== condition.value;
    case 'contains':
      return typeof actualValue === 'string' && 
             actualValue.includes(condition.value);
    case 'not_contains':
      return typeof actualValue === 'string' && 
             !actualValue.includes(condition.value);
    default:
      return false;
  }
};

// Execute the action
const executeAction = async (action, task, user) => {
  if (!action || !action.type) {
    return;
  }

  switch (action.type) {
    case 'change_status':
      await Task.findByIdAndUpdate(task._id, { 
        status: action.value,
        $push: { 
          history: {
            field: 'status',
            oldValue: task.status,
            newValue: action.value,
            changedBy: 'automation'
          }
        }
      });
      break;

    case 'assign_badge':
      if (task.assignee) {
        await User.findByIdAndUpdate(task.assignee, {
          $push: { 
            badges: {
              name: action.value.name || 'Achievement',
              description: action.value.description || 'Task completed successfully'
            }
          }
        });

        // Notify user about the badge
        await Notification.create({
          userId: task.assignee,
          title: 'New Badge Earned!',
          message: `You earned the "${action.value.name || 'Achievement'}" badge`,
          type: 'system',
          relatedItemId: task._id,
          relatedItemType: 'Task'
        });
      }
      break;

    case 'send_notification':
      if (task.assignee) {
        await Notification.create({
          userId: task.assignee,
          title: action.value.title || 'Task Update',
          message: action.value.message || `Task "${task.title}" has been updated`,
          type: 'task',
          relatedItemId: task._id,
          relatedItemType: 'Task'
        });
      }
      break;

    case 'assign_user':
      const previousAssignee = task.assignee;
      await Task.findByIdAndUpdate(task._id, { 
        assignee: action.value,
        $push: { 
          history: {
            field: 'assignee',
            oldValue: previousAssignee,
            newValue: action.value,
            changedBy: 'automation'
          }
        }
      });

      // Notify the newly assigned user
      await Notification.create({
        userId: action.value,
        title: 'Task Assigned',
        message: `Task "${task.title}" has been assigned to you`,
        type: 'task',
        relatedItemId: task._id,
        relatedItemType: 'Task'
      });
      break;
  }
};
