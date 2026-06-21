import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// Test profile endpoint (protected)
router.get('/profile', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Test profile endpoint is working',
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: new Date().toISOString()
    }
  });
});

// Test admin endpoint (protected + admin role required)
router.get('/admin', protect, authorizeRoles('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Test admin endpoint is working',
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      permissions: ['read', 'write', 'delete'],
      createdAt: new Date().toISOString()
    }
  });
});

export default router;
