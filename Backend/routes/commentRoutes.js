import express from 'express';
import { 
  createComment,
  getTaskComments,
  deleteComment
} from '../controllers/commentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes need authentication
router.use(authenticateToken);

// Comment routes
router.post('/', createComment);
router.get('/task/:taskId', getTaskComments);
router.delete('/:commentId', deleteComment);

export default router;
