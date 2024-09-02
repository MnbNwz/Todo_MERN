import { body, param } from 'express-validator';

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
const validateReAssignTask = [
  param('adminID').isMongoId().withMessage('Invalid admin ID format'),
  param('oldUserId').isMongoId().withMessage('Invalid old user ID format'),
  param('newUserId').isMongoId().withMessage('Invalid new user ID format'),
  param('taskId').isMongoId().withMessage('Invalid task ID format')
];
const getTasksValidationRules = [
  param('userId').isMongoId().withMessage('Invalid user ID')
];
const registerValidationRules = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 5 })
    .withMessage('Username must be at least 5 characters long'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];
const loginValidationRules = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .notEmpty()
    .withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required')
];
export {
  createTaskValidationRules,
  validateReAssignTask,
  getTasksValidationRules,
  registerValidationRules,
  loginValidationRules
};
