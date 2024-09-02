import { validationResult } from 'express-validator';
import TaskModel from '../models/TaskModel.js';
import UserModel from '../models/UserModel.js';
import mongoose from 'mongoose';

// Create a new task for a user
const createTaskForUser = async (req, res) => {
  try {
    const { userId, taskData } = req.body;

    // Validate user ID format
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Fetch the user
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create and save the task
    const task = new TaskModel({
      ...taskData,
      userId: user._id
    });
    await task.save();

    // Return the created task with additional user details
    const response = {
      ...task.toObject(), // Converts the Mongoose document to a plain object
      username: user.username // Adding username from the user document
    };

    return res.status(201).json(response);
  } catch (err) {
    console.error('Error creating task:', err.message || err);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: err.message || err
    });
  }
};

// Get all tasks for a user
const getTasksForUser = async (req, res) => {
  // Validate request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id: userID } = req?.user;

    // Validate userId format
    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Fetch tasks for the user
    const userTasks = await TaskModel.find({ userId: userID });

    if (!userTasks.length) {
      return res.status(200).json({ message: 'No tasks found for this user' });
    }

    // Return the list of tasks
    return res.status(200).json(userTasks);
  } catch (err) {
    console.error('Error fetching tasks:', err.message || err);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: err.message || err });
  }
};

// Reassign a task from one user to another
const reAssignTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { oldUserId, newUserId, taskId } = req.params;

    // Validate ObjectIDs
    if (
      !mongoose.isValidObjectId(oldUserId) ||
      !mongoose.isValidObjectId(newUserId) ||
      !mongoose.isValidObjectId(taskId)
    ) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Check if the admin has the role of 1 (admin)
    const admin = await UserModel.findById(req?.user.id);
    if (!admin || admin.role !== roles.ADMIN) {
      return res.status(403).json({
        message: 'Permission denied. Only admins can reassign tasks.'
      });
    }

    // Find the specific task that belongs to the oldUserId
    const task = await TaskModel.findOne({ _id: taskId, userId: oldUserId });
    if (!task) {
      return res.status(404).json({
        message: 'Task not found or does not belong to the specified user'
      });
    }

    // Update the task with the new user ID
    task.userId = newUserId;
    await task.save();

    return res
      .status(200)
      .json({ message: 'Task reassigned successfully', task });
  } catch (err) {
    console.error('Error reassigning task:', err);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: err.message });
  }
};

export { createTaskForUser, getTasksForUser, reAssignTask };
