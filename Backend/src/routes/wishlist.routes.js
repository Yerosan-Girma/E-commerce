import express from 'express';
import {
  addProduct,
  removeProduct,
  getWishlist,
} from '../controllers/wishlist.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Define routes (mapped relative to /api/wishlist)
router.post('/', addProduct);
router.get('/', getWishlist);
router.delete('/:productId', removeProduct);

export default router;
