import Review from '../models/Review.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Add a review for a product
// @route   POST /api/reviews
// @access  Private (Authenticated users only)
export const addReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  // Validate required fields
  if (!productId || !rating || !comment) {
    const error = new Error('Please provide productId, rating, and comment');
    error.statusCode = 400;
    throw error;
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user already reviewed this product (duplicate prevention)
  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    const error = new Error('You have already reviewed this product');
    error.statusCode = 400;
    throw error;
  }

  // Create review
  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  });

  // Update product average rating and numReviews using aggregation pipeline
  const ratingStats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  // Update product with new rating stats
  if (ratingStats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: ratingStats[0].averageRating,
      numReviews: ratingStats[0].numReviews,
    });
  }

  // Populate review with user details
  const populatedReview = await Review.findById(review._id).populate(
    'user',
    'name email'
  );

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: populatedReview,
  });
});

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Get all reviews for the product
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Reviews retrieved successfully',
    data: reviews,
    count: reviews.length,
  });
});
