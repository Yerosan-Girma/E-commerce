import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Store from '../models/Store.js';
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

// @desc    Get all orders containing this vendor's products
// @route   GET /api/orders/vendor
// @access  Private (Vendor only)
export const getVendorOrders = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }

  const products = await Product.find({ store: store._id }).select('_id');
  const productIds = products.map(p => p._id);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ 'orderItems.product': { $in: productIds } })
      .populate('user', 'name email')
      .populate('orderItems.product', 'title images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ 'orderItems.product': { $in: productIds } }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Vendor orders retrieved successfully',
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Update order status (vendor advances shipping state)
// @route   PUT /api/orders/vendor/:id/status
// @access  Private (Vendor only)
export const updateVendorOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowedTransitions = ['Processing', 'Shipped', 'Delivered'];

  if (!allowedTransitions.includes(status)) {
    const error = new Error(`Invalid status. Vendor can set: ${allowedTransitions.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }

  const products = await Product.find({ store: store._id }).select('_id');
  const productIds = products.map(p => p._id);

  const order = await Order.findOne({
    _id: req.params.id,
    'orderItems.product': { $in: productIds },
  });

  if (!order) {
    const error = new Error('Order not found or does not belong to your store');
    error.statusCode = 404;
    throw error;
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    data: order,
  });
});
