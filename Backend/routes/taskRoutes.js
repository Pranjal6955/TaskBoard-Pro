import express from 'express';
import { 
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  updateProjectStatuses,
  getUserTasks
} from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Task CRUD routes
router.post('/', createTask);
router.get('/project/:projectId', getProjectTasks);
router.get('/user/assigned', getUserTasks); // Add this new route
router.get('/:taskId', getTaskById);
router.put('/:taskId', updateTask);
router.patch('/:taskId/status', updateTaskStatus);
router.delete('/:taskId', deleteTask);

// Project statuses routes
router.put('/project/:projectId/statuses', updateProjectStatuses);

export default router;
