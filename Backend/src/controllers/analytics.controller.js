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

  // Get all products for this vendor's store
  const products = await Product.find({ store: store._id }).select('_id');
  const productIds = products.map(p => p._id);

  // Total Revenue
  const revenueResult = await Order.aggregate([
    {
      $match: {
        'orderItems.product': { $in: productIds },
        status: { $in: ['Paid', 'Processing', 'Shipped', 'Delivered'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' }
      }
    }
  ]);
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  // Monthly Revenue (last 12 months)
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        'orderItems.product': { $in: productIds },
        status: { $in: ['Paid', 'Processing', 'Shipped', 'Delivered'] },
        createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$totalPrice' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    },
    {
      $project: {
        month: '$_id.month',
        year: '$_id.year',
        revenue: 1,
        _id: 0
      }
    }
  ]);

  // Orders Count
  const ordersCount = await Order.countDocuments({
    'orderItems.product': { $in: productIds }
  });

  // Top Products
  const topProducts = await Order.aggregate([
    {
      $match: {
        'orderItems.product': { $in: productIds },
        status: { $in: ['Paid', 'Processing', 'Shipped', 'Delivered'] }
      }
    },
    {
      $unwind: '$orderItems'
    },
    {
      $match: {
        'orderItems.product': { $in: productIds }
      }
    },
    {
      $group: {
        _id: '$orderItems.product',
        totalSold: { $sum: '$orderItems.quantity' },
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
      }
    },
    {
      $sort: { totalSold: -1 }
    },
    {
      $limit: 5
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $unwind: '$product'
    },
    {
      $project: {
        productId: '$_id',
        title: '$product.title',
        totalSold: 1,
        revenue: 1,
        _id: 0
      }
    }
  ]);

  // Top Customers
  const topCustomers = await Order.aggregate([
    {
      $match: {
        'orderItems.product': { $in: productIds },
        status: { $in: ['Paid', 'Processing', 'Shipped', 'Delivered'] }
      }
    },
    {
      $group: {
        _id: '$user',
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalPrice' }
      }
    },
    {
      $sort: { totalSpent: -1 }
    },
    {
      $limit: 5
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'customer'
      }
    },
    {
      $unwind: '$customer'
    },
    {
      $project: {
        customerId: '$_id',
        name: '$customer.name',
        email: '$customer.email',
        totalOrders: 1,
        totalSpent: 1,
        _id: 0
      }
    }
  ]);

  res.status(200).json({
    success: true,
    message: 'Vendor analytics retrieved successfully',
    data: {
      totalRevenue,
      monthlyRevenue,
      ordersCount,
      topProducts,
      topCustomers
    }
  });
});

// @desc    Get admin analytics dashboard data
// @route   GET /api/analytics/admin
// @access  Private (Admin only)
export const getAdminAnalytics = asyncHandler(async (req, res) => {
  // Users Count
  const usersCount = await User.countDocuments({ role: 'customer' });

  // Vendors Count
  const vendorsCount = await User.countDocuments({ role: 'vendor' });

  // Products Count
  const productsCount = await Product.countDocuments();

  // Orders Count
  const ordersCount = await Order.countDocuments();

  // Sales Revenue
  const revenueResult = await Order.aggregate([
    {
      $match: {
        status: { $in: ['Paid', 'Processing', 'Shipped', 'Delivered'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' }
      }
    }
  ]);
  const salesRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  // Monthly Sales (last 12 months)
  const monthlySales = await Order.aggregate([
    {
      $match: {
        status: { $in: ['Paid', 'Processing', 'Shipped', 'Delivered'] },
        createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    },
    {
      $project: {
        month: '$_id.month',
        year: '$_id.year',
        revenue: 1,
        orders: 1,
        _id: 0
      }
    }
  ]);

  // Orders by Status
  const ordersByStatus = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

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
      ordersByStatus
    }
  });
});
