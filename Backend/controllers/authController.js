import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const generateToken = async (req, res) => {
  try {
    const { uid, email, name, photoURL } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ message: 'UID and email are required' });
    }
    
    // Save or update user in the database
    try {
      // Use upsert operation for atomic update or create
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
      console.error('Database error when saving user:', dbError);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { uid, email, name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ message: 'Error generating token', error: error.message });
  }
};
