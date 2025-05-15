const Automation = require('../models/Automation');
const Project = require('../models/Project');

// Get all automations for a project
exports.getAutomations = async (req, res) => {
  try {
    const automations = await Automation.find({
      projectId: req.params.projectId
    });
    
    res.status(200).json(automations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching automations' });
  }
};

// Get a single automation
exports.getAutomation = async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.automationId);
    
    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }
    
    res.status(200).json(automation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching automation' });
  }
};

// Create an automation
exports.createAutomation = async (req, res) => {
  try {
    const { 
      projectId, 
      name, 
      triggerType, 
      condition, 
      action 
    } = req.body;
    
    if (!projectId || !name || !triggerType || !action || !action.type) {
      return res.status(400).json({ 
        message: 'Project ID, name, trigger type, and action are required' 
      });
    }
    
    // Validate project access (middleware should handle this)
    const project = await Project.findById(projectId);
    
    // Validate trigger type
    const validTriggers = [
      'task_status_changed', 
      'task_assigned', 
      'task_due_date_passed', 
      'task_created'
    ];
    
    if (!validTriggers.includes(triggerType)) {
      return res.status(400).json({ 
        message: 'Invalid trigger type. Choose from: ' + validTriggers.join(', ') 
      });
    }
    
    // Validate action type
    const validActions = [
      'change_status', 
      'assign_badge', 
      'send_notification', 
      'assign_user'
    ];
    
    if (!validActions.includes(action.type)) {
      return res.status(400).json({ 
        message: 'Invalid action type. Choose from: ' + validActions.join(', ') 
      });
    }
    
    // Additional validation based on action type
    if (action.type === 'change_status' && 
        !project.statuses.includes(action.value)) {
      return res.status(400).json({ 
        message: 'Invalid status for action. Choose from: ' + project.statuses.join(', ') 
      });
    }
    
    const automation = new Automation({
      projectId,
      name,
      triggerType,
      condition,
      action,
      createdBy: req.user._id,
      isActive: true
    });
    
    await automation.save();
    
    res.status(201).json(automation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating automation' });
  }
};

// Update an automation
exports.updateAutomation = async (req, res) => {
  try {
    const { 
      name, 
      triggerType, 
      condition, 
      action,
      isActive 
    } = req.body;
    
    const updates = {};
    
    if (name) updates.name = name;
    if (triggerType) {
      const validTriggers = [
        'task_status_changed', 
        'task_assigned', 
        'task_due_date_passed', 
        'task_created'
      ];
      
      if (!validTriggers.includes(triggerType)) {
        return res.status(400).json({ 
          message: 'Invalid trigger type. Choose from: ' + validTriggers.join(', ') 
        });
      }
      
      updates.triggerType = triggerType;
    }
    
    if (condition) updates.condition = condition;
    
    if (action) {
      const validActions = [
        'change_status', 
        'assign_badge', 
        'send_notification', 
        'assign_user'
      ];
      
      if (!validActions.includes(action.type)) {
        return res.status(400).json({ 
          message: 'Invalid action type. Choose from: ' + validActions.join(', ') 
        });
      }
      
      if (action.type === 'change_status') {
        const automation = await Automation.findById(req.params.automationId);
        const project = await Project.findById(automation.projectId);
        
        if (!project.statuses.includes(action.value)) {
          return res.status(400).json({ 
            message: 'Invalid status for action. Choose from: ' + project.statuses.join(', ') 
          });
        }
      }
      
      updates.action = action;
    }
    
    if (isActive !== undefined) updates.isActive = isActive;
    
    const automation = await Automation.findByIdAndUpdate(
      req.params.automationId,
      updates,
      { new: true }
    );
    
    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }
    
    res.status(200).json(automation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating automation' });
  }
};

// Delete an automation
exports.deleteAutomation = async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.automationId);
    
    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }
    
    await automation.remove();
    
    res.status(200).json({ message: 'Automation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting automation' });
  }
};
