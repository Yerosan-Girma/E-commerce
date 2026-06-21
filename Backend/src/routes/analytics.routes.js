import express from 'express';
import {
  getVendorAnalytics,
  getAdminAnalytics,
} from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Vendor analytics route
router.get('/vendor', authorizeRoles('vendor'), getVendorAnalytics);

// Admin analytics route
router.get('/admin', authorizeRoles('admin'), getAdminAnalytics);

export default router;
