const Category = require('../models/Category');

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    try {
        const { name, description, image, isActive } = req.body;

        if (!name || !description) {
            return res.status(400).json({ success: false, message: 'Please provide name and description' });
        }

        const category = await Category.create({
            name,
            description,
            image,
            isActive
        });

        res.status(201).json({ success: true, data: category });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Category name already exists' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all active categories (Admins can get all)
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        let query = {};
        
        // If not an admin, only show active categories
        // We can check if req.admin exists (if we pass it through an optional auth middleware)
        // But for public endpoints, we usually don't have req.admin. 
        // Let's assume this is public and only returns active. Admins can view all if needed through a different route, or we keep it simple: GET returns active for everyone unless specified.
        // Based on rules: "Customers can only view active categories."
        // We'll just enforce isActive: true for public GET requests.
        query.isActive = true;

        const categories = await Category.find(query);
        res.status(200).json({ success: true, count: categories.length, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Ensure customers can only view active categories
        if (!category.isActive) {
             return res.status(403).json({ success: false, message: 'Category is not active' });
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Invalid category ID' });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // If name is being updated, handle slug generation in the model or here. 
        // findByIdAndUpdate doesn't trigger pre-save hooks by default.
        // We can fetch, modify, and save to trigger the hook.
        
        const { name, description, image, isActive } = req.body;
        
        if (name) category.name = name;
        if (description) category.description = description;
        if (image !== undefined) category.image = image;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Category name already exists' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        await category.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Invalid category ID' });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
