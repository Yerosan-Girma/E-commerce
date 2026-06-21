import express from 'express';
import {
  getNotifications,
  markAsRead,
} from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Define routes (mapped relative to /api/notifications)
router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);

export default router;
