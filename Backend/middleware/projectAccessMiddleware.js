const Project = require('../models/Project');

exports.checkProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is a member of the project
    const isMember = project.members.some(member => 
      member.userId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied: You are not a member of this project' });
    }

    // Add project to the request object for future use
    req.project = project;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during access check' });
  }
};

exports.checkProjectOwnership = async (req, res, next) => {
  try {
    const project = req.project || await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the owner of the project
    const isOwner = project.members.some(member => 
      member.userId.toString() === req.user._id.toString() && member.role === 'owner'
    );

    if (!isOwner) {
      return res.status(403).json({ message: 'Access denied: Only project owners can perform this action' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during ownership check' });
  }
};
