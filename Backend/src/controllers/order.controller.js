import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (Authenticated users only)
export const placeOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  // Validate required fields
  if (!orderItems || orderItems.length === 0) {
    const error = new Error('Please provide order items');
    error.statusCode = 400;
    throw error;
  }

  if (!shippingAddress || !paymentMethod) {
    const error = new Error('Please provide shipping address and payment method');
    error.statusCode = 400;
    throw error;
  }

  // Create order directly from provided data
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: itemsPrice || 0,
    taxPrice: taxPrice || 0,
    shippingPrice: shippingPrice || 0,
    totalPrice: totalPrice || 0,
    status: 'Pending',
  });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
});

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private (Authenticated users only)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('orderItems.product', 'title images')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Orders retrieved successfully',
    data: orders,
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Authenticated users only)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'orderItems.product',
    'title images'
  );

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user is the order owner
  if (order.user.toString() !== req.user._id.toString()) {
    const error = new Error('Not authorized to access this order');
    error.statusCode = 403;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: 'Order retrieved successfully',
    data: order,
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Authenticated users only)
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user is the order owner
  if (order.user.toString() !== req.user._id.toString()) {
    const error = new Error('Not authorized to cancel this order');
    error.statusCode = 403;
    throw error;
  }

  // Check if order can be cancelled (only Pending orders can be cancelled)
  if (order.status !== 'Pending') {
    const error = new Error('Order cannot be cancelled at this stage');
    error.statusCode = 400;
    throw error;
  }

  // Use transaction to cancel order and restore product stock
  const session = await Order.startSession();
  session.startTransaction();

  try {
    // Restore product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    // Update order status
    order.status = 'Cancelled';
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
