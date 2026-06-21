import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';

// Socket.io instance (will be set from server.js)
let io = null;

export const setSocketIO = (socketIO) => {
  io = socketIO;
};

// Helper function to emit notification via Socket.io
const emitNotification = (userId, notification) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification', notification);
  }
};

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private (Authenticated users only)
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    message: 'Notifications retrieved successfully',
    data: notifications,
    unreadCount,
  });
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private (Authenticated users only)
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    const error = new Error('Notification not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user is the recipient
  if (notification.recipient.toString() !== req.user._id.toString()) {
    const error = new Error('Not authorized to access this notification');
    error.statusCode = 403;
    throw error;
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

// @desc    Create notification (internal function)
export const createNotification = async (recipientId, message, type, relatedOrder = null) => {
  const notification = await Notification.create({
    recipient: recipientId,
    message,
    type,
    relatedOrder,
  });

  // Emit via Socket.io
  emitNotification(recipientId, notification);

  return notification;
};
