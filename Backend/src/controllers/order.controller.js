import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (Authenticated users only)
export const placeOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

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

  if (!['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'].includes(paymentMethod)) {
    const error = new Error('Please provide a valid payment method');
    error.statusCode = 400;
    throw error;
  }

  const session = await mongoose.startSession();
  let order;
  let payment;

  try {
    await session.withTransaction(async () => {
      const productIds = orderItems.map((item) => item.product).filter(Boolean);
      const products = await Product.find({ _id: { $in: productIds } }).session(session);
      const productsById = new Map(products.map((product) => [product._id.toString(), product]));

      const normalizedItems = orderItems.map((item) => {
        const product = productsById.get(item.product?.toString());
        if (!product) {
          const error = new Error(`Product not found for order item: ${item.product}`);
          error.statusCode = 404;
          throw error;
        }

        const quantity = Number(item.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) {
          const error = new Error('Order item quantity must be at least 1');
          error.statusCode = 400;
          throw error;
        }

        if (product.stock < quantity) {
          const error = new Error(`Insufficient stock for ${product.title}`);
          error.statusCode = 400;
          throw error;
        }

        return {
          product: product._id,
          title: product.title,
          quantity,
          price: product.price,
        };
      });

      for (const item of normalizedItems) {
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );

        if (!updatedProduct) {
          const error = new Error(`Insufficient stock for ${item.title}`);
          error.statusCode = 400;
          throw error;
        }
      }

      const computedItemsPrice = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const normalizedTaxPrice = Number.isFinite(Number(taxPrice)) ? Number(taxPrice) : 0;
      const normalizedShippingPrice = Number.isFinite(Number(shippingPrice)) ? Number(shippingPrice) : 0;
      const normalizedTotalPrice = Number.isFinite(Number(totalPrice))
        ? Number(totalPrice)
        : computedItemsPrice + normalizedTaxPrice + normalizedShippingPrice;

      const [createdOrder] = await Order.create([{
        user: req.user._id,
        orderItems: normalizedItems,
        shippingAddress: {
          fullName: shippingAddress.fullName || shippingAddress.name || '',
          address: shippingAddress.address || shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state || '',
          postalCode: shippingAddress.postalCode || shippingAddress.zip,
          country: shippingAddress.country,
          phone: shippingAddress.phone || '',
        },
        paymentMethod,
        itemsPrice: Number.isFinite(Number(itemsPrice)) ? Number(itemsPrice) : computedItemsPrice,
        taxPrice: normalizedTaxPrice,
        shippingPrice: normalizedShippingPrice,
        totalPrice: normalizedTotalPrice,
        status: 'Pending',
      }], { session });

      const [createdPayment] = await Payment.create([{
        order: createdOrder._id,
        amount: createdOrder.totalPrice,
        paymentMethod,
        status: 'Pending',
      }], { session });

      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } },
        { session }
      );

      order = createdOrder;
      payment = createdPayment;
    });
  } finally {
    session.endSession();
  }

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: {
      order,
      payment,
    },
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
  // Get products directly by seller (vendor) - no store required
  const products = await Product.find({ seller: req.user._id }).select('_id');
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

  // Get products directly by seller (vendor) - no store required
  const products = await Product.find({ seller: req.user._id }).select('_id');
  const productIds = products.map(p => p._id);

  const order = await Order.findOne({
    _id: req.params.id,
    'orderItems.product': { $in: productIds },
  });

  if (!order) {
    const error = new Error('Order not found or does not belong to your products');
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
