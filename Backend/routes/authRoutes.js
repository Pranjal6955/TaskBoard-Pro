import express from 'express';
import { generateToken } from '../controllers/authController.js';

const router = express.Router();

// Generate token for authenticated users
router.post('/token', generateToken);

export default router;
