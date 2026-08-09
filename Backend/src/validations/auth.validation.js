// auth.validation.js
// Input validation helpers for authentication routes.
// Uses plain JS — install express-validator or joi for richer validation if needed.

/**
 * Validate registration input.
 * Returns an array of error messages (empty array means valid).
 * @param {{ name?: string, email?: string, password?: string }} body
 * @returns {string[]}
 */
export const validateRegister = ({ name, email, password } = {}) => {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  return errors;
};

/**
 * Validate login input.
 * Returns an array of error messages (empty array means valid).
 * @param {{ email?: string, password?: string }} body
 * @returns {string[]}
 */
export const validateLogin = ({ email, password } = {}) => {
  const errors = [];

  if (!email || !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return errors;
};

/**
 * Express middleware — validates registration body and short-circuits with 400 on failure.
 */
export const registerValidation = (req, res, next) => {
  const errors = validateRegister(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }
  next();
};

/**
 * Express middleware — validates login body and short-circuits with 400 on failure.
 */
export const loginValidation = (req, res, next) => {
  const errors = validateLogin(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }
  next();
};
