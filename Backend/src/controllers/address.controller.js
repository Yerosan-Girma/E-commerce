import Address from '../models/Address.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private (Authenticated users only)
export const addAddress = asyncHandler(async (req, res) => {
  const { country, city, street, postalCode, phone, isDefault } = req.body;

  // Validate required fields
  if (!country || !city || !street || !postalCode || !phone) {
    const error = new Error('Please provide all required address fields');
    error.statusCode = 400;
    throw error;
  }

  // If setting as default, remove default from other addresses
  if (isDefault) {
    await Address.updateMany(
      { user: req.user._id },
      { isDefault: false }
    );
  }

  const address = await Address.create({
    user: req.user._id,
    country,
    city,
    street,
    postalCode,
    phone,
    isDefault: isDefault || false,
  });

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: address,
  });
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private (Authenticated users only)
export const updateAddress = asyncHandler(async (req, res) => {
  const { country, city, street, postalCode, phone, isDefault } = req.body;

  const address = await Address.findById(req.params.id);

  if (!address) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user is the owner of the address
  if (address.user.toString() !== req.user._id.toString()) {
    const error = new Error('Not authorized to update this address');
    error.statusCode = 403;
    throw error;
  }

  // If setting as default, remove default from other addresses
  if (isDefault && !address.isDefault) {
    await Address.updateMany(
      { user: req.user._id, _id: { $ne: req.params.id } },
      { isDefault: false }
    );
  }

  // Update address fields
  address.country = country || address.country;
  address.city = city || address.city;
  address.street = street || address.street;
  address.postalCode = postalCode || address.postalCode;
  address.phone = phone || address.phone;
  address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

  await address.save();

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: address,
  });
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private (Authenticated users only)
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user is the owner of the address
  if (address.user.toString() !== req.user._id.toString()) {
    const error = new Error('Not authorized to delete this address');
    error.statusCode = 403;
    throw error;
  }

  await Address.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
    data: null,
  });
});

// @desc    Get user's addresses
// @route   GET /api/addresses
// @access  Private (Authenticated users only)
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    message: 'Addresses retrieved successfully',
    data: addresses,
  });
});
