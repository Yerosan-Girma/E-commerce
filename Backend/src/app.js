import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware.js';

// Load environment variables
dotenv.config();

const app = express();

// Body parser middleware
app.use(express.json());

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Multi-Vendor E-Commerce API is running',
  });
});

// Centralized error handling middleware
app.use(errorHandler);

export default app;
