import express from 'express';
import User from '../models/userModel.js';
import Task from '../models/taskModel.js';
import Badge from '../models/badgeModel.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create or update user
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, photoURL, uid } = req.body;
    
    // Verify the token's uid matches the request body uid
    if (req.user.uid !== uid) {
      return res.status(403).json({ message: 'Unauthorized: Token doesn\'t match the user' });
    }

    // Find user by uid and update, or create if doesn't exist
    const user = await User.findOneAndUpdate(
      { uid },
      { name, email, photoURL, uid },
      { new: true, upsert: true }
    );

    res.status(200).json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ message: 'Error creating/updating user', error: error.message });
  }
});

// Get user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Get user statistics
router.get('/me/stats', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    
    // Get tasks completed by user
    const completedTasks = await Task.find({
      'assignee.userId': uid,
      status: 'Done'
    }).countDocuments();
    
    // Get total badges earned
    const totalBadges = await Badge.find({
      userId: uid
    }).countDocuments();
    
    // Get projects user is a member of
    const user = await User.findOne({ uid });
    
    res.status(200).json({
      tasksCompleted: completedTasks,
      badgesEarned: totalBadges,
      userInfo: {
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        badges: user.badges || { total: 0, types: {} }
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user statistics', error: error.message });
  }
});

export default router;
