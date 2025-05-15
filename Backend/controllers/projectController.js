const Project = require('../models/Project');
const User = require('../models/User');
const crypto = require('crypto');

// Get all projects for current user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      'members.userId': req.user._id
    }).select('-pendingInvites');

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      'members.userId': req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching project' });
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const project = new Project({
      title,
      description,
      members: [{
        userId: req.user._id,
        role: 'owner',
        email: req.user.email,
        name: req.user.name
      }],
      statuses: ['To Do', 'In Progress', 'Done']
    });

    await project.save();

    // Add project to user's projects
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { projects: project._id } }
    );

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating project' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { title, description, statuses } = req.body;
    const updates = {};

    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (statuses) updates.statuses = statuses;

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.projectId,
        'members.userId': req.user._id,
        'members.role': 'owner'
      },
      { $set: updates },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ 
        message: 'Project not found or you do not have permission to update it' 
      });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating project' });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.projectId,
      'members.userId': req.user._id,
      'members.role': 'owner'
    });

    if (!project) {
      return res.status(404).json({ 
        message: 'Project not found or you do not have permission to delete it' 
      });
    }

    // Remove project from all users' projects array
    await User.updateMany(
      { projects: req.params.projectId },
      { $pull: { projects: req.params.projectId } }
    );

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting project' });
  }
};

// Invite user to project
exports.inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const project = await Project.findOne({
      _id: req.params.projectId,
      'members.userId': req.user._id,
      'members.role': 'owner'
    });

    if (!project) {
      return res.status(404).json({ 
        message: 'Project not found or you do not have permission to invite users' 
      });
    }

    // Check if user is already a member
    const memberExists = project.members.some(member => member.email === email);
    if (memberExists) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    // Check if invitation already exists
    const inviteExists = project.pendingInvites.some(invite => invite.email === email);
    if (inviteExists) {
      return res.status(400).json({ message: 'Invitation already sent to this email' });
    }

    // Generate invitation token
    const token = crypto.randomBytes(20).toString('hex');
    
    // Add to pending invites
    project.pendingInvites.push({
      email,
      role: role || 'member',
      token
    });

    await project.save();

    // Here you would typically send an email with the invitation link
    // For now, we'll just return the token as part of the response
    res.status(200).json({ 
      message: 'Invitation sent successfully',
      inviteToken: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sending invitation' });
  }
};

// Accept project invitation
exports.acceptInvitation = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Invitation token is required' });
    }

    // Find project with this pending invite
    const project = await Project.findOne({
      'pendingInvites.token': token,
      'pendingInvites.email': req.user.email
    });

    if (!project) {
      return res.status(404).json({ message: 'Invalid or expired invitation' });
    }

    // Get invite details
    const invite = project.pendingInvites.find(inv => inv.token === token);
    
    // Add user to project members
    project.members.push({
      userId: req.user._id,
      role: invite.role,
      email: req.user.email,
      name: req.user.name
    });

    // Remove from pending invites
    project.pendingInvites = project.pendingInvites.filter(inv => inv.token !== token);
    
    await project.save();

    // Add project to user's projects
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { projects: project._id } }
    );

    res.status(200).json({ 
      message: 'Invitation accepted successfully',
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error accepting invitation' });
  }
};

// Remove user from project
exports.removeUser = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Only project owners can remove users
    const project = await Project.findOne({
      _id: req.params.projectId,
      'members.userId': req.user._id,
      'members.role': 'owner'
    });

    if (!project) {
      return res.status(404).json({ 
        message: 'Project not found or you do not have permission to remove users' 
      });
    }

    // Check if trying to remove the owner
    const isOwner = project.members.some(
      member => member.userId.toString() === userId && member.role === 'owner'
    );

    if (isOwner) {
      return res.status(400).json({ 
        message: 'Cannot remove the project owner. Transfer ownership first.' 
      });
    }

    // Remove user from project
    project.members = project.members.filter(
      member => member.userId.toString() !== userId
    );
    
    await project.save();

    // Remove project from user's projects
    await User.findByIdAndUpdate(
      userId,
      { $pull: { projects: project._id } }
    );

    res.status(200).json({ 
      message: 'User removed from project successfully',
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing user from project' });
  }
};
