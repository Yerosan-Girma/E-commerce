import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.warn('[JWT] Using default JWT_SECRET - set JWT_SECRET in production for security');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export default generateToken;
