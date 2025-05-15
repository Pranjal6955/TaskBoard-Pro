const admin = require('../config/firebaseConfig');
const User = require('../models/User');

// Verify Firebase JWT
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Get user from token
      const userDoc = await User.findOne({ firebaseUid: decodedToken.uid });
      
      // If user doesn't exist in our DB yet, create one
      if (!userDoc) {
        const newUser = new User({
          name: decodedToken.name || 'User',
          email: decodedToken.email,
          firebaseUid: decodedToken.uid,
          projects: []
        });
        await newUser.save();
        req.user = newUser;
      } else {
        req.user = userDoc;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
