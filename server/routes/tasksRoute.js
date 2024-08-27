const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Validation rules for creating a task
const createTaskValidationRules = [
  body('userId').isMongoId().withMessage('Invalid user ID'),
  body('taskData.description')
    .notEmpty()
    .withMessage('Description is required'),
  body('taskData.status')
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Invalid status'),
  body('taskData.dueDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Invalid due date'),
  body('taskData.severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity'),
  body('taskData.priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('taskData.category')
    .optional()
    .isString()
    .trim()
    .withMessage('Invalid category')
];

// Validation rules for getting tasks
const getTasksValidationRules = [
  param('userId').isMongoId().withMessage('Invalid user ID')
];

// Route to create a new task
router.post(
  '/registerTask',
  createTaskValidationRules,
  taskController.createTaskForUser
);

// Route to get all tasks for a user
router.get(
  '/getTasks/:userId',
  getTasksValidationRules,
  taskController.getTasksForUser
);

module.exports = router;
