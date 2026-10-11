import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getVendorOrders,
  updateVendorOrderStatus,
} from '../controllers/order.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Vendor routes (must come before /:id to avoid conflict)
router.get('/vendor', authorizeRoles('vendor'), getVendorOrders);
router.put('/vendor/:id/status', authorizeRoles('vendor'), updateVendorOrderStatus);

// Customer routes
router.post('/', placeOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export default router;
