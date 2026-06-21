import express from 'express';
import {
  createPaymentIntent,
  verifyPayment,
} from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Define routes (mapped relative to /api/payments)
router.post('/create-intent', createPaymentIntent);
router.post('/verify', verifyPayment);

export default router;
