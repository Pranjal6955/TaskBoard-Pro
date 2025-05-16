import Project from '../models/projectModel.js';
import User from '../models/userModel.js';
import { sendProjectInvitation } from '../services/emailService.js';

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { uid, email } = req.user;
    
    const project = new Project({
      title,
      description,
      createdBy: uid,
      members: [
        {
          userId: uid,
          email,
          role: 'owner',
          joinedAt: Date.now()
        }
      ]
    });
    
    await project.save();
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

// Get all projects for current user
export const getUserProjects = async (req, res) => {
  try {
    const { uid } = req.user;
    
    const projects = await Project.find({
      'members.userId': uid
    });
    
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { uid } = req.user;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is a member of the project
    const isMember = project.members.some(member => member.userId === uid);
    
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this project.' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description } = req.body;
    const { uid } = req.user;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is a member of the project
    const userMember = project.members.find(member => member.userId === uid);
    
    if (!userMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this project.' });
    }
    
    // Only allow updates if user is owner
    if (userMember.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Only project owners can update project details.' });
    }
    
    project.title = title || project.title;
    project.description = description || project.description;
    project.updatedAt = Date.now();
    
    await project.save();
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

// Invite user to project
export const inviteUserToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;
    const { uid } = req.user;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is a member of the project with owner role
    const userMember = project.members.find(member => member.userId === uid);
    
    if (!userMember || userMember.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Only project owners can invite users.' });
    }
    
    // Check if user is already a member
    const isAlreadyMember = project.members.some(member => member.email === email);
    
    if (isAlreadyMember) {
      return res.status(400).json({ message: 'User is already a member of this project.' });
    }
    
    // Find user by email (if they exist)
    const user = await User.findOne({ email });
    
    // Add user to project members
    project.members.push({
      userId: user ? user.uid : null,
      email,
      role: 'member',
      joinedAt: Date.now()
    });
    
    await project.save();
    
    // Get the inviter's name
    const inviter = await User.findOne({ uid });
    
    // Generate invitation link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const invitationLink = `${frontendUrl}/projects/${projectId}`;
    
    // Send invitation email
    try {
      if (process.env.EMAIL_USER) {
        await sendProjectInvitation({
          email,
          projectName: project.title,
          inviterName: inviter?.name || 'A project owner',
          invitationLink
        });
        console.log(`Invitation email sent to ${email}`);
      }
    } catch (emailError) {
      console.error('Error sending invitation email:', emailError);
      // Don't fail the request if email sending fails
    }
    
    res.status(200).json({ message: 'User invited successfully', project });
  } catch (error) {
    console.error('Error inviting user to project:', error);
    res.status(500).json({ message: 'Error inviting user to project', error: error.message });
  }
};

// Remove user from project
export const removeUserFromProject = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const { uid } = req.user;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is a member of the project with owner role
    const userMember = project.members.find(member => member.userId === uid);
    
    if (!userMember || userMember.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Only project owners can remove users.' });
    }
    
    // Cannot remove yourself (owner) from the project
    if (userId === uid) {
      return res.status(400).json({ message: 'Cannot remove project owner. Transfer ownership first.' });
    }
    
    // Remove user from project members
    const memberToRemove = project.members.find(member => member.userId === userId || member.email === userId);
    
    if (!memberToRemove) {
      return res.status(404).json({ message: 'Member not found in project' });
    }
    
    project.members = project.members.filter(member => 
      member.userId !== userId && member.email !== userId
    );
    
    await project.save();
    
    res.status(200).json({ message: 'User removed successfully', project });
  } catch (error) {
    console.error('Error removing user from project:', error);
    res.status(500).json({ message: 'Error removing user from project', error: error.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { uid } = req.user;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is the project owner
    const isOwner = project.members.some(member => member.userId === uid && member.role === 'owner');
    
    if (!isOwner) {
      return res.status(403).json({ message: 'Access denied. Only project owner can delete a project.' });
    }
    
    await Project.findByIdAndDelete(projectId);
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};
