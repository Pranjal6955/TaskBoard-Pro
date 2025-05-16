import Comment from '../models/commentModel.js';
import Task from '../models/taskModel.js';
import Project from '../models/projectModel.js';
import User from '../models/userModel.js';
import { getIO } from '../websocket/socketServer.js';

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { taskId, content } = req.body;
    const { uid } = req.user;
    
    // Verify the task exists
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
    
    // Get user data for author field
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const comment = new Comment({
      taskId,
      projectId: task.projectId,
      content,
      author: {
        userId: uid,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL
      }
    });
    
    await comment.save();
    
    // Emit real-time update via WebSocket
    const io = getIO();
    io.to(`project:${task.projectId}`).emit('comment-added', { 
      taskId, 
      projectId: task.projectId,
      comment
    });
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

// Get comments for a task
export const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { uid } = req.user;
    
    // Verify the task exists
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
    
    const comments = await Comment.find({ taskId }).sort({ createdAt: 1 });
    
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { uid } = req.user;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Only allow comment author or project owner to delete
    if (comment.author.userId !== uid) {
      // Check if user is project owner
      const project = await Project.findById(comment.projectId);
      const isOwner = project?.members.some(
        member => member.userId === uid && member.role === 'owner'
      );
      
      if (!isOwner) {
        return res.status(403).json({ message: 'Access denied. You can only delete your own comments.' });
      }
    }
    
    await Comment.findByIdAndDelete(commentId);
    
    // Emit real-time update via WebSocket
    const io = getIO();
    io.to(`project:${comment.projectId}`).emit('comment-deleted', {
      commentId,
      taskId: comment.taskId,
      projectId: comment.projectId
    });
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};
