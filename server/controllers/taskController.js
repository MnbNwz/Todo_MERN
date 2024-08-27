const { validationResult } = require('express-validator');
const TaskModel = require('../models/TaskModel');
const UserModel = require('../models/UserModel');
const mongoose = require('mongoose');

// Create a new task for a user
exports.createTaskForUser = async (req, res) => {
  try {
    const { userId, taskData } = req.body;

    console.log('UserId:', userId); // Debug log
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      console.log(user);
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new task
    const task = new TaskModel({
      ...taskData,
      userId: user._id
    });
    await task.save();
    const { username } = user;
    let newVar = { ...taskData, username };

    console.log('Task:', newVar); // Debug log
    debugger;
    // Save task to database

    return res.status(201).json(newVar);
  } catch (err) {
    console.error('Error creating task:', err.message || err);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: err.message || err });
  }
};

// Get all tasks for a user
exports.getTasksForUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.params;
    debugger;
    const tasks = await TaskModel.find({ userId });
    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }

    return res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.reAsignTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, TaskId } = req.params;
    const tasks = await Task.find({ user: userId });
    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }

    return res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
