import Automation from '../models/automationModel.js';
import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';
import Badge from '../models/badgeModel.js';
import Notification from '../models/notificationModel.js';

// Create a new automation rule
export const createAutomation = async (req, res) => {
  try {
    const { projectId, name, trigger, action } = req.body;
    const { uid } = req.user;
    
    // Verify that the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that the user is a project owner
    const userMember = project.members.find(member => member.userId === uid);
    if (!userMember || userMember.role !== 'owner') {
      return res.status(403).json({ message: 'Only project owners can create automation rules' });
    }
    
    // Validate trigger and action based on type
    if (trigger.type === 'STATUS_CHANGE') {
      // Validate statuses
      if (!project.statuses.includes(trigger.fromStatus) || 
          !project.statuses.includes(trigger.toStatus)) {
        return res.status(400).json({ 
          message: 'Invalid status in trigger',
          validStatuses: project.statuses
        });
      }
    }
    
    if (action.type === 'MOVE_TASK') {
      if (!project.statuses.includes(action.targetStatus)) {
        return res.status(400).json({ 
          message: 'Invalid status in action',
          validStatuses: project.statuses
        });
      }
    }
    
    const automation = new Automation({
      projectId,
      name,
      trigger,
      action,
      createdBy: uid
    });
    
    await automation.save();
    
    res.status(201).json(automation);
  } catch (error) {
    console.error('Error creating automation rule:', error);
    res.status(500).json({ message: 'Error creating automation rule', error: error.message });
  }
};

// Get all automations for a project
export const getProjectAutomations = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { uid } = req.user;
    
    // Verify that the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that user is a member of the project
    const isMember = project.members.some(member => member.userId === uid);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this project.' });
    }
    
    const automations = await Automation.find({ projectId });
    
    res.status(200).json(automations);
  } catch (error) {
    console.error('Error fetching automations:', error);
    res.status(500).json({ message: 'Error fetching automations', error: error.message });
  }
};

// Update an automation rule
export const updateAutomation = async (req, res) => {
  try {
    const { automationId } = req.params;
    const { name, trigger, action, isActive } = req.body;
    const { uid } = req.user;
    
    const automation = await Automation.findById(automationId);
    if (!automation) {
      return res.status(404).json({ message: 'Automation rule not found' });
    }
    
    // Verify that the project exists
    const project = await Project.findById(automation.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that the user is a project owner
    const userMember = project.members.find(member => member.userId === uid);
    if (!userMember || userMember.role !== 'owner') {
      return res.status(403).json({ message: 'Only project owners can update automation rules' });
    }
    
    // Update automation fields
    if (name) automation.name = name;
    if (trigger) {
      // Validate trigger based on type
      if (trigger.type === 'STATUS_CHANGE') {
        if (!project.statuses.includes(trigger.fromStatus) || 
            !project.statuses.includes(trigger.toStatus)) {
          return res.status(400).json({ 
            message: 'Invalid status in trigger',
            validStatuses: project.statuses
          });
        }
      }
      automation.trigger = trigger;
    }
    
    if (action) {
      // Validate action based on type
      if (action.type === 'MOVE_TASK') {
        if (!project.statuses.includes(action.targetStatus)) {
          return res.status(400).json({ 
            message: 'Invalid status in action',
            validStatuses: project.statuses
          });
        }
      }
      automation.action = action;
    }
    
    if (isActive !== undefined) automation.isActive = isActive;
    automation.updatedAt = Date.now();
    
    await automation.save();
    
    res.status(200).json(automation);
  } catch (error) {
    console.error('Error updating automation rule:', error);
    res.status(500).json({ message: 'Error updating automation rule', error: error.message });
  }
};

// Delete an automation rule
export const deleteAutomation = async (req, res) => {
  try {
    const { automationId } = req.params;
    const { uid } = req.user;
    
    const automation = await Automation.findById(automationId);
    if (!automation) {
      return res.status(404).json({ message: 'Automation rule not found' });
    }
    
    // Verify that the project exists
    const project = await Project.findById(automation.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that the user is a project owner
    const userMember = project.members.find(member => member.userId === uid);
    if (!userMember || userMember.role !== 'owner') {
      return res.status(403).json({ message: 'Only project owners can delete automation rules' });
    }
    
    await Automation.findByIdAndDelete(automationId);
    
    res.status(200).json({ message: 'Automation rule deleted successfully' });
  } catch (error) {
    console.error('Error deleting automation rule:', error);
    res.status(500).json({ message: 'Error deleting automation rule', error: error.message });
  }
};

// Get all badges for a user
export const getUserBadges = async (req, res) => {
  try {
    const { uid } = req.user;
    
    const badges = await Badge.find({ userId: uid });
    
    res.status(200).json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ message: 'Error fetching badges', error: error.message });
  }
};

// Get user notifications
export const getUserNotifications = async (req, res) => {
  try {
    const { uid } = req.user;
    
    const notifications = await Notification.find({ userId: uid })
                                          .sort({ createdAt: -1 })
                                          .limit(50);
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { uid } = req.user;
    
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Verify ownership
    if (notification.userId !== uid) {
      return res.status(403).json({ message: 'Access denied. This notification belongs to another user.' });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};
