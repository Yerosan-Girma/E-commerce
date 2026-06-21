import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';

const router = express.Router();

// Define routes (mapped relative to /api/auth)
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
