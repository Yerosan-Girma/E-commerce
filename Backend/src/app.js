import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import testRoutes from './routes/test.routes.js';
import storeRoutes from './routes/store.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';

// Load environment variables
dotenv.config();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize request body keys (trim spaces)
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitizedBody = {};
    for (const key of Object.keys(req.body)) {
      sanitizedBody[key.trim()] = req.body[key];
    }
    req.body = sanitizedBody;
  }
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

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
