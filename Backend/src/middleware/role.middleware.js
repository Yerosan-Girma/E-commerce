import asyncHandler from '../utils/asyncHandler.js';

export const authorizeRoles = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      const error = new Error('Not authorized, no user session found');
      error.statusCode = 401;
      throw error;
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error(`User role '${req.user.role}' is not authorized to access this resource`);
      error.statusCode = 403;
      throw error;
    }

    next();
  });
};
