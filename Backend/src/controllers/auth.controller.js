import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, profileImage } = req.body;

  // Validate duplicate email
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error('User already exists with this email address');
    error.statusCode = 400;
    throw error;
  }

  // Create new user (password is automatically hashed by pre-save middleware)
  const user = await User.create({
    name,
    email,
    password,
    role,
    profileImage,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      vendorStatus: user.vendorStatus,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      token,
    },
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  console.log('[LOGIN] Attempting login with:', { email, role });

  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    console.log('[LOGIN] User not found for email:', email);
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  console.log('[LOGIN] User found:', { email: user.email, role: user.role });

  // Verify credentials
  const isMatch = await user.comparePassword(password);
  console.log('[LOGIN] Password match result:', isMatch);
  if (!isMatch) {
    console.log('[LOGIN] Password does not match');
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Validate role if provided — gives a clear error instead of silently failing
  if (role && user.role !== role) {
    const error = new Error(
      `This account is registered as a "${user.role}". Please select the correct role and try again.`
    );
    error.statusCode = 403;
    throw error;
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      vendorStatus: user.vendorStatus,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      token,
    },
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: req.user,
  });
});
