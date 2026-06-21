import express from 'express';
import { createStore, getMyStore, updateStore } from '../controllers/store.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// All routes require authentication and vendor role
router.use(protect);
router.use(authorizeRoles('vendor'));

// Define routes (mapped relative to /api/stores)
router.post('/', createStore);
router.get('/my-store', getMyStore);
router.put('/:id', updateStore);

export default router;
