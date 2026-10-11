import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  updateUserStatus,
  getUserById,
  deleteUser,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// Private routes — authenticated users
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

// Admin-only routes
router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.put('/:id/status', protect, authorizeRoles('admin'), updateUserStatus);
router.get('/:id', protect, authorizeRoles('admin'), getUserById);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

export default router;
