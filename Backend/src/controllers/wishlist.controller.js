import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private (Authenticated users only)
export const addProduct = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  // Validate required fields
  if (!productId) {
    const error = new Error('Please provide productId');
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

  // Find or create wishlist for user
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    // Create new wishlist
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
  } else {
    // Check if product already exists in wishlist (prevent duplicates)
    if (wishlist.products.includes(productId)) {
      const error = new Error('Product already in wishlist');
      error.statusCode = 400;
      throw error;
    }

    // Add product to wishlist
    wishlist.products.push(productId);
    await wishlist.save();
  }

  // Populate wishlist with product details
  wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'products',
    'title price images rating'
  );

  res.status(200).json({
    success: true,
    message: 'Product added to wishlist successfully',
    data: wishlist,
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private (Authenticated users only)
export const removeProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    const error = new Error('Wishlist not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if product exists in wishlist
  const productIndex = wishlist.products.indexOf(productId);
  if (productIndex === -1) {
    const error = new Error('Product not found in wishlist');
    error.statusCode = 404;
    throw error;
  }

  // Remove product from wishlist
  wishlist.products.splice(productIndex, 1);
  await wishlist.save();

  // Populate wishlist with product details
  const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'products',
    'title price images rating'
  );

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist successfully',
    data: updatedWishlist,
  });
});

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private (Authenticated users only)
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'products',
    'title price images rating'
  );

  if (!wishlist) {
    // Return empty wishlist if none exists
    return res.status(200).json({
      success: true,
      message: 'Wishlist retrieved successfully',
      data: {
        user: req.user._id,
        products: [],
      },
    });
  }

  res.status(200).json({
    success: true,
    message: 'Wishlist retrieved successfully',
    data: wishlist,
  });
});
