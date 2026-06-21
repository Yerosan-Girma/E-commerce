import express from 'express';
import {
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses,
} from '../controllers/address.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Define routes (mapped relative to /api/addresses)
router.post('/', addAddress);
router.get('/', getAddresses);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;
