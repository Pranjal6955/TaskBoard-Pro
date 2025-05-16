import express from 'express';
import { 
  createProject, 
  getUserProjects, 
  getProjectById,
  updateProject,
  inviteUserToProject,
  removeUserFromProject,
  deleteProject
} from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes need authentication
router.use(authenticateToken);

// Project CRUD routes
router.post('/', createProject);
router.get('/', getUserProjects);
router.get('/:projectId', getProjectById);
router.put('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);

// Project member management
router.post('/:projectId/invite', inviteUserToProject);
router.delete('/:projectId/members/:userId', removeUserFromProject);

export default router;
