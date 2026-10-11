import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production');

      // Get user from database, excluding password field, and attach to request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        const error = new Error('Not authorized, user not found');
        error.statusCode = 401;
        throw error;
      }

      return next();
    } catch (error) {
      const err = new Error('Not authorized, token failed');
      err.statusCode = 401;
      throw err;
    }
  }

  if (!token) {
    const error = new Error('Not authorized, no token provided');
    error.statusCode = 401;
    throw error;
  }
});
