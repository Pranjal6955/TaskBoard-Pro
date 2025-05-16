import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/userModel.js';

const router = express.Router();

// Generate and return JWT token for Firebase authenticated users
router.post('/token', async (req, res) => {
  try {
    const { uid, email, name, photoURL } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ message: 'UID and email are required' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { uid, email, name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Save or update user in database
    try {
      await User.findOneAndUpdate(
        { uid },
        { 
          uid,
          email,
          name: name || email.split('@')[0],
          photoURL: photoURL || '',
          updatedAt: Date.now()
        },
        { 
          upsert: true,
          new: true,
          runValidators: true 
        }
      );
    } catch (dbError) {
      console.error('Error saving user to database:', dbError);
      // Continue even if DB operation fails
    }
    
    res.status(200).json({ token });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ message: 'Error generating token', error: error.message });
  }
});

// Test endpoint to verify authentication
router.get('/test', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Authentication successful', 
    user: {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name
    }
  });
});

export default router;
