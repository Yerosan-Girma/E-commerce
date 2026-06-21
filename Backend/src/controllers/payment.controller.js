import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import asyncHandler from '../utils/asyncHandler.js';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private (Authenticated users only)
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  // Validate required fields
  if (!orderId) {
    const error = new Error('Please provide orderId');
    error.statusCode = 400;
    throw error;
  }

  // Find order
  const order = await Order.findById(orderId);

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

  // Check if order is already paid
  if (order.status === 'Paid' || order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered') {
    const error = new Error('Order is already paid');
    error.statusCode = 400;
    throw error;
  }

  // Check if payment already exists for this order
  const existingPayment = await Payment.findOne({ order: orderId });
  if (existingPayment && existingPayment.status === 'Completed') {
    const error = new Error('Payment already completed for this order');
    error.statusCode = 400;
    throw error;
  }

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // Convert to cents
    currency: 'usd',
    metadata: {
      orderId: orderId.toString(),
    },
  });

  // Create or update payment record
  let payment;
  if (existingPayment) {
    existingPayment.transactionId = paymentIntent.id;
    existingPayment.amount = order.totalPrice;
    existingPayment.paymentMethod = order.paymentMethod;
    existingPayment.status = 'Pending';
    payment = await existingPayment.save();
  } else {
    payment = await Payment.create({
      order: orderId,
      amount: order.totalPrice,
      paymentMethod: order.paymentMethod,
      transactionId: paymentIntent.id,
      status: 'Pending',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Payment intent created successfully',
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: order.totalPrice,
    },
  });
});

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private (Authenticated users only)
export const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;

  // Validate required fields
  if (!paymentIntentId) {
    const error = new Error('Please provide paymentIntentId');
    error.statusCode = 400;
    throw error;
  }

  // Retrieve payment intent from Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // Find payment record
  const payment = await Payment.findOne({ transactionId: paymentIntentId });

  if (!payment) {
    const error = new Error('Payment not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user is the order owner
  const order = await Order.findById(payment.order);
  if (order.user.toString() !== req.user._id.toString()) {
    const error = new Error('Not authorized to access this payment');
    error.statusCode = 403;
    throw error;
  }

  // Update payment status based on Stripe payment intent status
  if (paymentIntent.status === 'succeeded') {
    payment.status = 'Completed';
    await payment.save();

    // Update order status to Paid
    order.status = 'Paid';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment,
        order,
      },
    });
  } else if (paymentIntent.status === 'canceled') {
    payment.status = 'Failed';
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment canceled',
      data: {
        payment,
      },
    });
  } else {
    res.status(200).json({
      success: true,
      message: 'Payment processing',
      data: {
        payment,
        stripeStatus: paymentIntent.status,
      },
    });
  }
});
