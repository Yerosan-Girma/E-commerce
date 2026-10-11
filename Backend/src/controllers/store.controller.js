import Store from '../models/Store.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create a new store
// @route   POST /api/stores
// @access  Private (Vendor only)
export const createStore = asyncHandler(async (req, res) => {
  const { storeName, description, logo, address } = req.body;

  // Validate required fields
  if (!storeName || !address) {
    const error = new Error('Please provide store name and address');
    error.statusCode = 400;
    throw error;
  }

  // Store creation is now optional - vendors can have multiple stores

  // Create new store
  const store = await Store.create({
    storeName,
    description,
    logo,
    owner: req.user._id || null,
    address,
  });

  res.status(201).json({
    success: true,
    message: 'Store created successfully',
    data: store,
  });
});

// @desc    Get current vendor's store
// @route   GET /api/stores/my-store
// @access  Private (Vendor only)
export const getMyStore = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ owner: req.user._id });

  // Return empty array if no store exists (stores are now optional)
  res.status(200).json({
    success: true,
    message: 'Store retrieved successfully',
    data: store || null,
  });
});

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private (Vendor only, owner only)
export const updateStore = asyncHandler(async (req, res) => {
  const { storeName, description, logo, address, rating } = req.body;

  const store = await Store.findById(req.params.id);

  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if the user is the owner of the store
  if (store.owner.toString() !== req.user._id.toString()) {
    const error = new Error('Not authorized to update this store');
    error.statusCode = 403;
    throw error;
  }

  // Update store fields
  store.storeName = storeName || store.storeName;
  store.description = description !== undefined ? description : store.description;
  store.logo = logo !== undefined ? logo : store.logo;
  store.address = address || store.address;
  store.rating = rating !== undefined ? rating : store.rating;

  await store.save();

  res.status(200).json({
    success: true,
    message: 'Store updated successfully',
    data: store,
  });
});
