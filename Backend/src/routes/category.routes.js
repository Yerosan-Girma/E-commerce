import express from 'express';
import {
  createCategory,
  getCategories,
  deleteCategory,
} from '../controllers/category.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// Public route
router.get('/', getCategories);

// Protected routes - require authentication and admin role
router.post('/', protect, authorizeRoles('admin'), createCategory);
router.delete('/:id', protect, authorizeRoles('admin'), deleteCategory);

export default router;
