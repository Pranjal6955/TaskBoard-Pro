import express from 'express';
import { 
  createAutomation,
  getProjectAutomations,
  updateAutomation,
  deleteAutomation,
  getUserBadges,
  getUserNotifications,
  markNotificationRead
} from '../controllers/automationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes need authentication
router.use(authenticateToken);

// Automation CRUD routes
router.post('/', createAutomation);
router.get('/project/:projectId', getProjectAutomations);
router.put('/:automationId', updateAutomation);
router.delete('/:automationId', deleteAutomation);

// Badge routes
router.get('/badges', getUserBadges);

// Notification routes
router.get('/notifications', getUserNotifications);
router.patch('/notifications/:notificationId/read', markNotificationRead);

export default router;
