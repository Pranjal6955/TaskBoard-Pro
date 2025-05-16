import Automation from '../models/automationModel.js';
import Task from '../models/taskModel.js';
import Project from '../models/projectModel.js';
import Badge from '../models/badgeModel.js';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';
import { scheduleJob } from 'node-schedule';

// Process the automations for a task
export const processTaskAutomations = async (task, previousTask = null) => {
  try {
    // Get the project
    const project = await Project.findById(task.projectId);
    if (!project) return;
    
    // Get active automations for this project
    const automations = await Automation.find({ 
      projectId: task.projectId,
      isActive: true
    });
    
    if (!automations || automations.length === 0) return;
    
    // Process each automation
    for (const automation of automations) {
      let shouldExecute = false;
      
      // Check if the trigger conditions are met
      switch (automation.trigger.type) {
        case 'STATUS_CHANGE':
          if (previousTask && 
              previousTask.status === automation.trigger.fromStatus && 
              task.status === automation.trigger.toStatus) {
            shouldExecute = true;
          }
          break;
          
        case 'ASSIGNMENT_CHANGE':
          if (previousTask &&
              (!previousTask.assignee || previousTask.assignee.userId !== automation.trigger.assigneeId) &&
              task.assignee && 
              (task.assignee.userId === automation.trigger.assigneeId || 
               task.assignee.email === automation.trigger.assigneeEmail)) {
            shouldExecute = true;
          }
          break;
          
        case 'DUE_DATE_PASSED':
          // This is triggered by a scheduler, not here directly
          break;
      }
      
      // If trigger conditions are met, execute the action
      if (shouldExecute) {
        await executeAutomationAction(automation, task, project);
      }
    }
  } catch (error) {
    console.error('Error processing automations:', error);
  }
};

// Execute an automation action
const executeAutomationAction = async (automation, task, project) => {
  try {
    switch (automation.action.type) {
      case 'ASSIGN_BADGE':
        await assignBadge(task, automation);
        break;
        
      case 'MOVE_TASK':
        await moveTask(task, automation);
        break;
        
      case 'SEND_NOTIFICATION':
        await sendNotification(task, project, automation);
        break;
    }
  } catch (error) {
    console.error('Error executing automation action:', error);
  }
};

// Assign a badge to the task assignee
const assignBadge = async (task, automation) => {
  try {
    if (!task.assignee || !task.assignee.userId) return;
    
    // Create the badge
    const badgeName = automation.action.badgeName || 'Task Completed';
    
    const badge = new Badge({
      userId: task.assignee.userId,
      name: badgeName,
      description: `Awarded for completing task: ${task.title}`,
      projectId: task.projectId,
      taskId: task._id
    });
    
    await badge.save();
    
    // Update user badge counters
    const badgeType = getBadgeType(badgeName);
    if (badgeType) {
      await User.findOneAndUpdate(
        { uid: task.assignee.userId },
        { 
          $inc: {
            'badges.total': 1,
            [`badges.types.${badgeType}`]: 1
          }
        }
      );
    }
    
    // Create a notification for the badge
    const notification = new Notification({
      userId: task.assignee.userId,
      title: 'New Badge Earned!',
      message: `You earned the "${badge.name}" badge for task: ${task.title}`,
      type: 'BADGE',
      relatedProjectId: task.projectId,
      relatedTaskId: task._id
    });
    
    await notification.save();
    
  } catch (error) {
    console.error('Error assigning badge:', error);
  }
};

// Helper function to map badge names to badge types
const getBadgeType = (badgeName) => {
  const lowerName = badgeName.toLowerCase();
  
  if (lowerName.includes('task master')) return 'taskMaster';
  if (lowerName.includes('problem solver')) return 'problemSolver';
  if (lowerName.includes('team player')) return 'teamPlayer';
  if (lowerName.includes('productivity')) return 'productivityStar';
  if (lowerName.includes('fast') || lowerName.includes('quick')) return 'fastCompleter';
  
  // Default to task master for generic badges
  return 'taskMaster';
};

// Move a task to a different status
const moveTask = async (task, automation) => {
  try {
    // Update the task status
    task.status = automation.action.targetStatus;
    await task.save();
    
    // Create a notification for the task creator
    const notification = new Notification({
      userId: task.createdBy,
      title: 'Task Status Changed',
      message: `Task "${task.title}" was moved to "${automation.action.targetStatus}" automatically.`,
      type: 'TASK',
      relatedProjectId: task.projectId,
      relatedTaskId: task._id
    });
    
    await notification.save();
    
  } catch (error) {
    console.error('Error moving task:', error);
  }
};

// Send a notification
const sendNotification = async (task, project, automation) => {
  try {
    const notificationTargets = [];
    
    // Determine who should be notified
    if (automation.action.notifyAssignee && task.assignee && task.assignee.userId) {
      notificationTargets.push(task.assignee.userId);
    }
    
    if (automation.action.notifyCreator) {
      notificationTargets.push(task.createdBy);
    }
    
    if (automation.action.notifyProjectOwners) {
      // Get project owners
      const ownerMembers = project.members.filter(member => member.role === 'owner');
      ownerMembers.forEach(member => {
        if (member.userId) notificationTargets.push(member.userId);
      });
    }
    
    // Remove duplicates
    const uniqueTargets = [...new Set(notificationTargets)];
    
    // Create notifications for each target
    for (const userId of uniqueTargets) {
      const notification = new Notification({
        userId,
        title: 'Task Notification',
        message: automation.action.notificationText || `Notification about task: ${task.title}`,
        type: 'TASK',
        relatedProjectId: task.projectId,
        relatedTaskId: task._id
      });
      
      await notification.save();
    }
    
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Set up a scheduler for due date passed automations
export const setupDueDateAutomations = () => {
  // Run daily at midnight
  const job = scheduleJob('0 0 * * *', async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Find tasks with due date in the past
      const overdueTasks = await Task.find({
        dueDate: { $lt: today }
      });
      
      for (const task of overdueTasks) {
        const automations = await Automation.find({
          projectId: task.projectId,
          isActive: true,
          'trigger.type': 'DUE_DATE_PASSED'
        });
        
        if (automations.length > 0) {
          const project = await Project.findById(task.projectId);
          
          for (const automation of automations) {
            await executeAutomationAction(automation, task, project);
          }
        }
      }
    } catch (error) {
      console.error('Error processing due date automations:', error);
    }
  });
  
  console.log('Due date automation scheduler set up');
  
  return job;
};
