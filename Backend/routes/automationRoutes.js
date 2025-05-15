const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automationController');
const { protect } = require('../middleware/authMiddleware');
const { checkProjectAccess, checkProjectOwnership } = require('../middleware/projectAccessMiddleware');

// All routes are protected
router.use(protect);

// Automation routes by project
router.get('/project/:projectId', checkProjectAccess, automationController.getAutomations);
router.post('/', checkProjectOwnership, automationController.createAutomation);

// Individual automation routes
router.get('/:automationId', automationController.getAutomation);
router.put('/:automationId', checkProjectOwnership, automationController.updateAutomation);
router.delete('/:automationId', checkProjectOwnership, automationController.deleteAutomation);

module.exports = router;
