import express from 'express';
import {
  addReview,
  getProductReviews,
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.get('/product/:productId', getProductReviews);

// Protected route - requires authentication
router.post('/', protect, addReview);

export default router;
