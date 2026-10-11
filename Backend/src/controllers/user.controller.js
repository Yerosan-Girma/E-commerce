import User from '../models/User.js';
import Order from '../models/Order.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: req.user,
  });
});

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, profileImage } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (profileImage !== undefined) user.profileImage = profileImage;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      vendorStatus: updatedUser.vendorStatus,
      profileImage: updatedUser.profileImage,
      isVerified: updatedUser.isVerified,
    },
  });
});

// @desc    Change current user password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    const error = new Error('Please provide current and new password');
    error.statusCode = 400;
    throw error;
  }

  // Re-fetch user with password field
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const users = await User.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean();
  const userIds = users.map((user) => user._id);

  const orderCounts = await Order.aggregate([
    { $match: { user: { $in: userIds } } },
    { $group: { _id: '$user', orders: { $sum: 1 } } },
  ]);

  const ordersByUser = new Map(orderCounts.map((item) => [item._id.toString(), item.orders]));
  const enrichedUsers = users.map((user) => ({
    ...user,
    status: user.status || 'active',
    vendorStatus: user.role === 'vendor' ? (user.vendorStatus || 'approved') : user.vendorStatus,
    orders: ordersByUser.get(user._id.toString()) || 0,
  }));

  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: enrichedUsers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Update user account/vendor status (admin only)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status, vendorStatus } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (status !== undefined) {
    if (!['active', 'suspended'].includes(status)) {
      const error = new Error('Invalid user status');
      error.statusCode = 400;
      throw error;
    }
    user.status = status;
  }

  if (vendorStatus !== undefined) {
    if (user.role !== 'vendor') {
      const error = new Error('Vendor status can only be set on vendor accounts');
      error.statusCode = 400;
      throw error;
    }
    if (!['pending', 'approved', 'rejected', 'suspended'].includes(vendorStatus)) {
      const error = new Error('Invalid vendor status');
      error.statusCode = 400;
      throw error;
    }
    user.vendorStatus = vendorStatus;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User status updated successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      vendorStatus: user.vendorStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: user,
  });
});

// @desc    Delete user by ID (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});
