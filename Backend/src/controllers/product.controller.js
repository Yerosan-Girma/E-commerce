import Product from '../models/Product.js';
import Store from '../models/Store.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Vendor only)
export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, images, price, stock, category, brand } = req.body;

  // Validate required fields
  if (!title || !description || !price || !stock || !category) {
    const error = new Error('Please provide title, description, price, stock, and category');
    error.statusCode = 400;
    throw error;
  }

  // Find the vendor's store
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    const error = new Error('Store not found. Please create a store first.');
    error.statusCode = 404;
    throw error;
  }

  // Create new product
  const product = await Product.create({
    title,
    description,
    images: images || [],
    price,
    stock,
    category,
    store: store._id,
    seller: req.user._id,
    brand,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

// @desc    Get all products with pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find()
    .populate('category', 'name description')
    .populate('store', 'storeName logo')
    .populate('seller', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments();

  res.status(200).json({
    success: true,
    message: 'Products retrieved successfully',
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name description')
    .populate('store', 'storeName logo address')
    .populate('seller', 'name email');

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor only, owner only)
export const updateProduct = asyncHandler(async (req, res) => {
  const { title, description, images, price, stock, category, brand, rating } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if the user is the seller (owner) of the product
  if (product.seller.toString() !== req.user._id.toString()) {
    const error = new Error('Not authorized to update this product');
    error.statusCode = 403;
    throw error;
  }

  // Update product fields
  product.title = title || product.title;
  product.description = description || product.description;
  product.images = images !== undefined ? images : product.images;
  product.price = price !== undefined ? price : product.price;
  product.stock = stock !== undefined ? stock : product.stock;
  product.category = category || product.category;
  product.brand = brand !== undefined ? brand : product.brand;
  product.rating = rating !== undefined ? rating : product.rating;

  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor only, owner only)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if the user is the seller (owner) of the product
  if (product.seller.toString() !== req.user._id.toString()) {
    const error = new Error('Not authorized to delete this product');
    error.statusCode = 403;
    throw error;
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: null,
  });
});
