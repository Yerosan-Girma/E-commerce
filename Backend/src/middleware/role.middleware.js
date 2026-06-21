export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('Not authorized, no user session found');
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error(`User role '${req.user.role}' is not authorized to access this resource`);
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};
