import express from 'express';
import {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart,
} from '../controllers/cart.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Define routes (mapped relative to /api/cart)
router.post('/', addToCart);
router.get('/', getCart);
router.put('/item/:productId', updateQuantity);
router.delete('/item/:productId', removeItem);
router.delete('/', clearCart);

export default router;
