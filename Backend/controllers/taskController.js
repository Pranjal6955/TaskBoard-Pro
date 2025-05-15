const Task = require('../models/Task');
const Project = require('../models/Project');
const Automation = require('../models/Automation');
const automationService = require('../services/automationService');

// Get all tasks for a project
exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Ensure user has access to this project (middleware should handle this)
    const tasks = await Task.find({ projectId })
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('assignee', 'name email')
      .populate('comments.userId', 'name email');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Project access check should be handled by middleware
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching task' });
  }
};

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, assignee, projectId } = req.body;
    
    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and project ID are required' });
    }
    
    // Ensure project exists and user is a member (handled by middleware)
    const project = await Project.findById(projectId);
    
    // Verify status is valid for this project
    if (status && !project.statuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Choose from: ' + project.statuses.join(', ')
      });
    }
    
    const task = new Task({
      title,
      description,
      dueDate,
      status: status || 'To Do',
      assignee,
      projectId,
      history: [{
        field: 'status',
        oldValue: null,
        newValue: status || 'To Do',
        changedBy: req.user._id
      }]
    });
    
    await task.save();

    // Get the io instance for real-time updates
    const io = req.app.get('io');
    io.to(projectId).emit('task-created', task);
    
    // Process any relevant automations for task creation
    await automationService.processAutomations('task_created', task, req.user);
    
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, assignee } = req.body;
    const updates = {};
    const history = [];
    
    // Fetch the original task for history tracking
    const originalTask = await Task.findById(req.params.taskId);
    
    if (!originalTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Build updates and history records
    if (title !== undefined && title !== originalTask.title) {
      updates.title = title;
      history.push({
        field: 'title',
        oldValue: originalTask.title,
        newValue: title,
        changedBy: req.user._id
      });
    }
    
    if (description !== undefined && description !== originalTask.description) {
      updates.description = description;
      history.push({
        field: 'description',
        oldValue: originalTask.description,
        newValue: description,
        changedBy: req.user._id
      });
    }
    
    if (dueDate !== undefined && new Date(dueDate).getTime() !== new Date(originalTask.dueDate).getTime()) {
      updates.dueDate = dueDate;
      history.push({
        field: 'dueDate',
        oldValue: originalTask.dueDate,
        newValue: dueDate,
        changedBy: req.user._id
      });
    }
    
    if (status !== undefined && status !== originalTask.status) {
      const project = await Project.findById(originalTask.projectId);
      
      if (!project.statuses.includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status. Choose from: ' + project.statuses.join(', ')
        });
      }
      
      updates.status = status;
      history.push({
        field: 'status',
        oldValue: originalTask.status,
        newValue: status,
        changedBy: req.user._id
      });
    }
    
    if (assignee !== undefined && assignee !== (originalTask.assignee && originalTask.assignee.toString())) {
      updates.assignee = assignee;
      history.push({
        field: 'assignee',
        oldValue: originalTask.assignee,
        newValue: assignee,
        changedBy: req.user._id
      });
    }
    
    // Add history records to updates
    if (history.length > 0) {
      updates.$push = { history: { $each: history } };
    }
    
    // Update the task
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      updates,
      { new: true }
    ).populate('assignee', 'name email');
    
    // Real-time update
    const io = req.app.get('io');
    io.to(task.projectId.toString()).emit('task-updated', task);
    
    // Process automations based on the updates
    if (history.length > 0) {
      for (const change of history) {
        if (change.field === 'status') {
          await automationService.processAutomations('task_status_changed', task, req.user);
        } else if (change.field === 'assignee') {
          await automationService.processAutomations('task_assigned', task, req.user);
        }
      }
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const projectId = task.projectId;
    
    // Delete the task
    await task.remove();
    
    // Real-time update
    const io = req.app.get('io');
    io.to(projectId.toString()).emit('task-deleted', req.params.taskId);
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

// Add comment to task
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        $push: {
          comments: {
            userId: req.user._id,
            userName: req.user.name,
            text
          }
        }
      },
      { new: true }
    ).populate('comments.userId', 'name email');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Real-time update
    const io = req.app.get('io');
    io.to(task.projectId.toString()).emit('task-comment-added', {
      taskId: task._id,
      comment: task.comments[task.comments.length - 1]
    });
    
    res.status(200).json({
      message: 'Comment added successfully',
      comment: task.comments[task.comments.length - 1]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};
