import Product from '../models/Product.js';
import Store from '../models/Store.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';
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

// @desc    Get all products with pagination, search, and filtering
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    brand,
    rating,
    seller,
    store: storeFilter,
    sortBy = 'latest',
  } = req.query;

  // Build match stage for filtering
  const matchStage = {};

  // Keyword search (title or description)
  if (keyword) {
    matchStage.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  // Category filter — must cast to ObjectId for aggregation pipeline
  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    } else {
      // Resolve category by name or slug
      const categoryDoc = await Category.findOne({
        $or: [
          { name: { $regex: `^${category}$`, $options: 'i' } },
          { slug: category.toLowerCase() },
        ],
      });
      if (categoryDoc) matchStage.category = categoryDoc._id;
    }
  }

  // Seller filter (for vendor product management)
  if (seller && mongoose.Types.ObjectId.isValid(seller)) {
    matchStage.seller = new mongoose.Types.ObjectId(seller);
  }

  // Store filter
  if (storeFilter && mongoose.Types.ObjectId.isValid(storeFilter)) {
    matchStage.store = new mongoose.Types.ObjectId(storeFilter);
  }

  // Price range filter
  if (minPrice || maxPrice) {
    matchStage.price = {};
    if (minPrice) matchStage.price.$gte = parseFloat(minPrice);
    if (maxPrice) matchStage.price.$lte = parseFloat(maxPrice);
  }

  // Brand filter
  if (brand) {
    matchStage.brand = { $regex: brand, $options: 'i' };
  }

  // Rating filter (minimum rating)
  if (rating) {
    matchStage.rating = { $gte: parseFloat(rating) };
  }

  // Build sort stage
  let sortStage = {};
  switch (sortBy) {
    case 'priceAsc':
      sortStage.price = 1;
      break;
    case 'priceDesc':
      sortStage.price = -1;
      break;
    case 'topRated':
      sortStage.rating = -1;
      break;
    case 'latest':
    default:
      sortStage.createdAt = -1;
      break;
  }

  // Aggregation pipeline
  const aggregationPipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $lookup: {
        from: 'stores',
        localField: 'store',
        foreignField: '_id',
        as: 'store',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'seller',
        foreignField: '_id',
        as: 'seller',
      },
    },
    {
      $unwind: {
        path: '$category',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$store',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$seller',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        images: 1,
        price: 1,
        stock: 1,
        brand: 1,
        rating: 1,
        numReviews: 1,
        createdAt: 1,
        updatedAt: 1,
        category: {
          _id: '$category._id',
          name: '$category.name',
          description: '$category.description',
        },
        store: {
          _id: '$store._id',
          storeName: '$store.storeName',
          logo: '$store.logo',
        },
        seller: {
          _id: '$seller._id',
          name: '$seller.name',
          email: '$seller.email',
        },
      },
    },
    { $sort: sortStage },
  ];

  // Get total count for pagination
  const totalPipeline = [...aggregationPipeline];
  totalPipeline.push({ $count: 'total' });
  const totalResult = await Product.aggregate(totalPipeline);
  const total = totalResult.length > 0 ? totalResult[0].total : 0;

  // Add pagination to pipeline
  aggregationPipeline.push({ $skip: skip });
  aggregationPipeline.push({ $limit: limit });

  const products = await Product.aggregate(aggregationPipeline);

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
