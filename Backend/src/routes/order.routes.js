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

// Customer routes
router.post('/', placeOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Vendor routes
router.get('/vendor', authorizeRoles('vendor'), getVendorOrders);
router.put('/vendor/:id/status', authorizeRoles('vendor'), updateVendorOrderStatus);

export default router;
