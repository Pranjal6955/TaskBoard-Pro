const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { checkProjectAccess } = require('../middleware/projectAccessMiddleware');

// All routes are protected
router.use(protect);

// Task routes by project
router.get('/project/:projectId', checkProjectAccess, taskController.getTasks);
router.post('/', taskController.createTask);

// Individual task routes
router.get('/:taskId', taskController.getTask);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);

// Task comments
router.post('/:taskId/comments', taskController.addComment);

module.exports = router;
