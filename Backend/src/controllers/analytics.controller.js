import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Store from '../models/Store.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get vendor analytics dashboard data
// @route   GET /api/analytics/vendor
// @access  Private (Vendor only)
export const getVendorAnalytics = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;

  // Get vendor's store
  const store = await Store.findOne({ owner: vendorId });
  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }

  // Get all products for this vendor's store (only _id needed)
  const products = await Product.find({ store: store._id }).select('_id');
  const productIds = products.map(p => p._id);

  if (productIds.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'Vendor analytics retrieved successfully',
      data: {
        totalRevenue: 0,
        monthlyRevenue: [],
        ordersCount: 0,
        topProducts: [],
        topCustomers: [],
      },
    });
  }

  // ── Run all aggregation pipelines in parallel for speed ─────────────────────
  const [revenueResult, monthlyRevenue, ordersCount, topProducts, topCustomers] = await Promise.all([

    // 1. Total Revenue — unwind items to calculate only vendor product revenue
    Order.aggregate([
      {
        $match: {
          'orderItems.product': { $in: productIds },
          status: { $in: ['Paid', 'Processing', 'Shipped', 'Delivered'] },
        },
      },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.product': { $in: productIds } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        },
      },
    ]),

    // 2. Monthly Revenue (last 12 months)
    Order.aggregate([
      {
        $match: {
          'orderItems.product': { $in: productIds },
          status: { $in: ['Paid', 'Processing', 'Shipped', 'Delivered'] },
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        },
      },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.product': { $in: productIds } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $project: { month: '$_id.month', year: '$_id.year', revenue: 1, _id: 0 } },
    ]),

    // 3. Orders Count (distinct orders containing at least one vendor product)
    Order.countDocuments({ 'orderItems.product': { $in: productIds } }),

    // 4. Top Products by units sold
    Order.aggregate([
      {
        $match: {
          'orderItems.product': { $in: productIds },
          status: { $in: ['Paid', 'Processing', 'Shipped', 'Delivered'] },
        },
      },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.product': { $in: productIds } } },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          title: '$product.title',
          totalSold: 1,
          revenue: 1,
          _id: 0,
        },
      },
    ]),

    // 5. Top Customers by total spend on vendor products
    Order.aggregate([
      {
        $match: {
          'orderItems.product': { $in: productIds },
          status: { $in: ['Paid', 'Processing', 'Shipped', 'Delivered'] },
        },
      },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.product': { $in: productIds } } },
      {
        $group: {
          _id: '$user',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      {
        $project: {
          customerId: '$_id',
          name: '$customer.name',
          email: '$customer.email',
          totalOrders: 1,
          totalSpent: 1,
          _id: 0,
        },
      },
    ]),
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  res.status(200).json({
    success: true,
    message: 'Vendor analytics retrieved successfully',
    data: {
      totalRevenue,
      monthlyRevenue,
      ordersCount,
      topProducts,
      topCustomers,
    },
  });
});

// @desc    Get admin analytics dashboard data
// @route   GET /api/analytics/admin
// @access  Private (Admin only)
export const getAdminAnalytics = asyncHandler(async (req, res) => {

  // Run all count queries in parallel
  const [usersCount, vendorsCount, productsCount, ordersCount, revenueResult, monthlySales, ordersByStatus] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'vendor' }),
    Product.countDocuments(),
    Order.countDocuments(),

    // Total Sales Revenue
    Order.aggregate([
      { $match: { status: { $in: ['Paid', 'Processing', 'Shipped', 'Delivered'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]),

    // Monthly Sales (last 12 months)
    Order.aggregate([
      {
        $match: {
          status: { $in: ['Paid', 'Processing', 'Shipped', 'Delivered'] },
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $project: { month: '$_id.month', year: '$_id.year', revenue: 1, orders: 1, _id: 0 } },
    ]),

    // Orders by Status
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  const salesRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  res.status(200).json({
    success: true,
    message: 'Admin analytics retrieved successfully',
    data: {
      usersCount,
      vendorsCount,
      productsCount,
      ordersCount,
      salesRevenue,
      monthlySales,
      ordersByStatus,
    },
  });
});
