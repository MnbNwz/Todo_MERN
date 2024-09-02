import express from 'express';
import userRoute from './authRoute.js';
import taskRoute from './tasksRoute.js';

const router = express.Router();

router.use('/user', userRoute);
router.use('/task', taskRoute);

export default router;
