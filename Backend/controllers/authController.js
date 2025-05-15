const User = require('../models/User');
const admin = require('../config/firebaseConfig');

// Login/Register with Firebase
exports.loginWithFirebase = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID token is required' });
    }

    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ firebaseUid: uid });

    // If not, create a new user
    if (!user) {
      user = new User({
        name: name || email.split('@')[0],
        email,
        firebaseUid: uid,
        projects: []
      });
      await user.save();
    }

    // Return user info
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      projects: user.projects
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving user profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true }
    ).select('-__v');

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
