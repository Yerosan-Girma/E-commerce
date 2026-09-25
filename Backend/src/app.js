import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import testRoutes from './routes/test.routes.js';
import storeRoutes from './routes/store.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import cartRoutes from './routes/cart.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import addressRoutes from './routes/address.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import userRoutes from './routes/user.routes.js';

// Load environment variables
dotenv.config();

const app = express();
app.disable('x-powered-by');

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173',
  'http://localhost:4173', // Vite preview
  'http://127.0.0.1:4173',
];

const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultAllowedOrigins;

// Regex to allow any Vercel preview deployment URL
const vercelPreviewRegex = /^https:\/\/.*\.vercel\.app$/;

app.use(cors({
  origin(origin, callback) {
    // Allow requests with no origin (e.g., curl, Postman, mobile apps)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Allow explicitly configured origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    // Allow any Vercel preview deployment
    if (vercelPreviewRegex.test(origin)) {
      callback(null, true);
      return;
    }

    console.warn(`[CORS] Blocked request from origin: ${origin}`);
    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
}));
app.use(compression());

// Body parser middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

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
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Multi-Vendor E-Commerce API is running',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
  });
});

// Centralized error handling middleware
app.use(errorHandler);

export default app;
