const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', authController.loginWithFirebase);

// Protected routes
router.get('/profile', protect, authController.getCurrentUser);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;
