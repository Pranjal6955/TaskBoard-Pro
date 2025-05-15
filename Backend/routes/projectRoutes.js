const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { checkProjectAccess, checkProjectOwnership } = require('../middleware/projectAccessMiddleware');

// All routes are protected
router.use(protect);

// Project routes
router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.get('/:projectId', checkProjectAccess, projectController.getProject);
router.put('/:projectId', checkProjectOwnership, projectController.updateProject);
router.delete('/:projectId', checkProjectOwnership, projectController.deleteProject);

// Project member routes
router.post('/:projectId/invite', checkProjectOwnership, projectController.inviteUser);
router.post('/accept-invitation', projectController.acceptInvitation);
router.delete('/:projectId/members', checkProjectOwnership, projectController.removeUser);

module.exports = router;
