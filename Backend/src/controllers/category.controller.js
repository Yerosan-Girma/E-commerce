import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (Admin only)
export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description } = req.body;

  // Validate required fields
  if (!name || !slug) {
    const error = new Error('Please provide category name and slug');
    error.statusCode = 400;
    throw error;
  }

  // Create new category
  const category = await Category.create({
    name,
    slug,
    description,
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Categories retrieved successfully',
    data: categories,
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
    data: null,
  });
});
