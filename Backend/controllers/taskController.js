import Task from '../models/taskModel.js';
import Project from '../models/projectModel.js';
import User from '../models/userModel.js';
import { processTaskAutomations } from '../services/automationService.js';
import { getIO } from '../websocket/socketServer.js';
import { sendTaskAssignment } from '../services/emailService.js';
import { isAuthorizedForTask } from '../utils/taskUtils.js';

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, status, assignee, dueDate } = req.body;
    const { uid } = req.user;
    
    // Verify that the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that user is a project owner
    const userMember = project.members.find(member => member.userId === uid);
    if (!userMember || userMember.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Only project owners can create tasks.' });
    }
    
    // Verify the status is valid for the project
    if (!project.statuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of the project statuses.',
        validStatuses: project.statuses
      });
    }
    
    // Find the assignee if provided by email
    let assigneeData = null;
    if (assignee) {
      // Check if the assignee email is a project member
      const assigneeMember = project.members.find(member => member.email === assignee);
      
      if (!assigneeMember) {
        return res.status(400).json({ message: 'Assignee must be a member of the project.' });
      }
      
      assigneeData = {
        userId: assigneeMember.userId,
        email: assigneeMember.email
      };
    }
    
    const task = new Task({
      title,
      description,
      projectId,
      status: status || project.statuses[0], // Default to first status if not provided
      assignee: assigneeData,
      dueDate,
      createdBy: uid
    });
    
    await task.save();
    
    // Send email notification to assignee if task is assigned
    if (assigneeData) {
      try {
        // Get the creator's name
        const creator = await User.findOne({ uid });
        
        // Generate task link
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const taskLink = `${frontendUrl}/projects/${projectId}?task=${task._id}`;
        
        await sendTaskAssignment({
          email: assigneeData.email,
          taskTitle: task.title,
          projectName: project.title,
          assignerName: creator ? creator.name : 'A team member',
          dueDate: task.dueDate,
          taskLink
        });
        console.log(`Task assignment email sent to ${assigneeData.email}`);
      } catch (emailError) {
        console.error('Error sending task assignment email:', emailError);
        // Don't fail the request if email sending fails
      }
    }
    
    // Emit real-time update via WebSocket
    const io = getIO();
    io.to(`project:${task.projectId}`).emit('task-created', task);
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Get all tasks for a project
export const getProjectTasks = async (req, res) => {
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
    
    const tasks = await Task.find({ projectId });
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { uid } = req.user;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify that the project exists
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that user is a member of the project
    const isMember = project.members.some(member => member.userId === uid);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this project.' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, assignee, dueDate } = req.body;
    const { uid } = req.user;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify that the project exists
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is the task assignee or project owner
    const userMember = project.members.find(member => member.userId === uid);
    const isProjectOwner = userMember && userMember.role === 'owner';
    
    // Only project owners can update most task details
    if (!isProjectOwner) {
      return res.status(403).json({ message: 'Access denied. Only project owners can update task details.' });
    }
    
    // Save the previous state for automation comparison
    const previousTask = { ...task.toObject() };
    
    // Check if assignee is changing
    const isAssigneeChanging = assignee !== undefined && 
      (!task.assignee || task.assignee.email !== assignee);
    
    // Update task fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    
    // Handle assignee update
    let newAssigneeData = null;
    if (assignee !== undefined) {
      if (assignee) {
        // Check if the assignee email is a project member
        const assigneeMember = project.members.find(member => member.email === assignee);
        
        if (!assigneeMember) {
          return res.status(400).json({ message: 'Assignee must be a member of the project.' });
        }
        
        newAssigneeData = {
          userId: assigneeMember.userId,
          email: assigneeMember.email
        };
        task.assignee = newAssigneeData;
      } else {
        task.assignee = null;
      }
    }
    
    if (dueDate !== undefined) task.dueDate = dueDate;
    task.updatedAt = Date.now();
    
    await task.save();
    
    // Send email notification if assignee was changed
    if (isAssigneeChanging && newAssigneeData) {
      try {
        // Get the assigner's name
        const assigner = await User.findOne({ uid });
        
        // Generate task link
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const taskLink = `${frontendUrl}/projects/${task.projectId}?task=${task._id}`;
        
        await sendTaskAssignment({
          email: newAssigneeData.email,
          taskTitle: task.title,
          projectName: project.title,
          assignerName: assigner ? assigner.name : 'A team member',
          dueDate: task.dueDate,
          taskLink
        });
        console.log(`Task assignment email sent to ${newAssigneeData.email}`);
      } catch (emailError) {
        console.error('Error sending task assignment email:', emailError);
        // Don't fail the request if email sending fails
      }
    }
    
    // Process automations
    await processTaskAutomations(task, previousTask);
    
    // Emit real-time update via WebSocket
    const io = getIO();
    io.to(`project:${task.projectId}`).emit('task-updated', task);
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Update task status (move task)
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const { uid } = req.user;
    
    console.log(`User ${uid} attempting to update task ${taskId} to status: ${status}`);
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify that the project exists
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is authorized (project owner, task assignee, or project member)
    if (!isAuthorizedForTask(task, project, uid)) {
      console.log('Authorization failed for user:', uid);
      return res.status(403).json({ 
        message: 'Access denied. Only project members can update task status.'
      });
    }

    // Verify the status is valid for the project
    if (!project.statuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of the project statuses.',
        validStatuses: project.statuses
      });
    }
    
    // Save the previous state for automation comparison
    const previousTask = { ...task.toObject() };
    
    task.status = status;
    task.updatedAt = Date.now();
    
    await task.save();
    console.log(`Task ${taskId} status updated to ${status}`);
    
    // Process automations
    await processTaskAutomations(task, previousTask);
    
    // Emit real-time update via WebSocket
    const io = getIO();
    io.to(`project:${task.projectId}`).emit('task-updated', task);
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Error updating task status', error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { uid } = req.user;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify that the project exists
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Only project owners can delete tasks
    const userMember = project.members.find(member => member.userId === uid);
    if (!userMember || userMember.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Only project owners can delete tasks.' });
    }
    
    await Task.findByIdAndDelete(taskId);
    
    // Emit real-time update via WebSocket
    const io = getIO();
    io.to(`project:${task.projectId}`).emit('task-deleted', { taskId, projectId: task.projectId });
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

// Update project statuses
export const updateProjectStatuses = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { statuses } = req.body;
    const { uid } = req.user;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that user has owner role in project
    const userMember = project.members.find(member => member.userId === uid);
    if (!userMember || userMember.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Only project owner can update statuses.' });
    }
    
    // Validate statuses array
    if (!Array.isArray(statuses) || statuses.length === 0) {
      return res.status(400).json({ message: 'Statuses must be a non-empty array of strings.' });
    }
    
    // Make sure all tasks with statuses not in the new list are moved to a default status
    const defaultStatus = statuses[0];
    const tasksToUpdate = await Task.find({
      projectId,
      status: { $nin: statuses }
    });
    
    // Update tasks with outdated statuses
    if (tasksToUpdate.length > 0) {
      await Task.updateMany(
        { 
          projectId,
          status: { $nin: statuses }
        },
        { status: defaultStatus }
      );
    }
    
    // Update project statuses
    project.statuses = statuses;
    await project.save();
    
    res.status(200).json({ 
      message: 'Project statuses updated successfully', 
      project,
      tasksUpdated: tasksToUpdate.length
    });
  } catch (error) {
    console.error('Error updating project statuses:', error);
    res.status(500).json({ message: 'Error updating project statuses', error: error.message });
  }
};

// Get tasks assigned to a user
export const getUserTasks = async (req, res) => {
  try {
    const { uid } = req.user;
    
    const tasks = await Task.find({
      'assignee.userId': uid
    }).populate({
      path: 'projectId',
      select: 'title members'
    });
    
    // Filter out tasks where the user might no longer be a member of the project
    const filteredTasks = tasks.filter(task => {
      if (!task.projectId) return false;
      return task.projectId.members.some(member => member.userId === uid);
    });
    
    res.status(200).json(filteredTasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: 'Error fetching user tasks', error: error.message });
  }
};
