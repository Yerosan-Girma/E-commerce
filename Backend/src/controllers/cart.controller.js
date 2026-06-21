import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private (Authenticated users only)
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  // Validate required fields
  if (!productId || !quantity) {
    const error = new Error('Please provide productId and quantity');
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

  // Check if product has enough stock
  if (product.stock < quantity) {
    const error = new Error('Insufficient stock');
    error.statusCode = 400;
    throw error;
  }

  // Find or create cart for user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity }],
    });
  } else {
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        const error = new Error('Insufficient stock');
        error.statusCode = 400;
        throw error;
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  // Populate cart with product details
  cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'title price images stock'
  );

  res.status(200).json({
    success: true,
    message: 'Product added to cart successfully',
    data: cart,
  });
});

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private (Authenticated users only)
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'title price images stock'
  );

  if (!cart) {
    // Return empty cart if none exists
    return res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: {
        user: req.user._id,
        items: [],
      },
    });
  }

  res.status(200).json({
    success: true,
    message: 'Cart retrieved successfully',
    data: cart,
  });
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/item/:productId
// @access  Private (Authenticated users only)
export const updateQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  // Validate required fields
  if (!quantity) {
    const error = new Error('Please provide quantity');
    error.statusCode = 400;
    throw error;
  }

  if (quantity < 1) {
    const error = new Error('Quantity must be at least 1');
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  // Find the item in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    const error = new Error('Item not found in cart');
    error.statusCode = 404;
    throw error;
  }

  // Check if product has enough stock
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  if (product.stock < quantity) {
    const error = new Error('Insufficient stock');
    error.statusCode = 400;
    throw error;
  }

  // Update quantity
  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  // Populate cart with product details
  const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'title price images stock'
  );

  res.status(200).json({
    success: true,
    message: 'Cart item quantity updated successfully',
    data: updatedCart,
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:productId
// @access  Private (Authenticated users only)
export const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  // Find the item in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    const error = new Error('Item not found in cart');
    error.statusCode = 404;
    throw error;
  }

  // Remove item from cart
  cart.items.splice(itemIndex, 1);
  await cart.save();

  // Populate cart with product details
  const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'title price images stock'
  );

  res.status(200).json({
    success: true,
    message: 'Item removed from cart successfully',
    data: updatedCart,
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private (Authenticated users only)
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
    data: cart,
  });
});
