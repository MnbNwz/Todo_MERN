import express from 'express';
import {
  createTaskForUser,
  getTasksForUser,
  reAssignTask
} from '../controllers/taskController.js';
import authenticateToken from '../Middleware/authMiddleware.js';
import {
  createTaskValidationRules,
  validateReAssignTask
} from '../Utils/ExpressValidatios.js';

const router = express.Router();

// Route to create a new task
router.post(
  '/registerTask',
  createTaskValidationRules,
  authenticateToken,
  createTaskForUser
);

// Route to get all tasks for a user
router.get('/getTasks', authenticateToken, getTasksForUser);

// Route to switch user for a task
router.put(
  '/updateTask/:oldUserId/:newUserId/:taskId',
  validateReAssignTask,
  authenticateToken,
  reAssignTask
);

export default router;
