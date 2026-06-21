import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes - require authentication and vendor role
router.post('/', protect, authorizeRoles('vendor'), createProduct);
router.put('/:id', protect, authorizeRoles('vendor'), updateProduct);
router.delete('/:id', protect, authorizeRoles('vendor'), deleteProduct);

export default router;
