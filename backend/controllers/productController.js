const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all active products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        // 1. Build query
        let queryObj = { isActive: true }; // Customers only see active products
        
        // Filtering
        const { search, category, shape, color, gender, brand, lensType, isFeatured, minPrice, maxPrice } = req.query;

        if (search) {
            queryObj.$or = [
                { name: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
            // If category is an exact name, we'd need to join, but frontend will pass category ID via filter usually.
        }
        
        if (category) {
            const mongoose = require('mongoose');
            if (mongoose.Types.ObjectId.isValid(category)) {
                queryObj.category = category;
            } else {
                const Category = require('../models/Category');
                const cat = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
                if (cat) {
                    queryObj.category = cat._id;
                } else {
                    // Category not found by name, intentionally make query fail to return 0 results
                    queryObj.category = new mongoose.Types.ObjectId(); 
                }
            }
        }
        if (shape) queryObj.frameShape = shape;
        if (color) queryObj.frameColor = { $regex: `^${color}$`, $options: 'i' }; // Case insensitive match
        if (gender) queryObj.gender = gender;
        if (brand) queryObj.brand = { $regex: `^${brand}$`, $options: 'i' };
        if (lensType) queryObj.lensTypes = lensType; // MongoDB matches if array contains the value
        if (isFeatured !== undefined) queryObj.isFeatured = isFeatured === 'true';
        
        // Price Range
        if (minPrice || maxPrice) {
            queryObj.price = {};
            if (minPrice) queryObj.price.$gte = Number(minPrice);
            if (maxPrice) queryObj.price.$lte = Number(maxPrice);
        }

        let query = Product.find(queryObj);

        // 2. Sorting
        if (req.query.sort) {
            switch(req.query.sort) {
                case 'featured':
                    query = query.sort({ isFeatured: -1, createdAt: -1 });
                    break;
                case 'price_asc':
                    query = query.sort({ price: 1 });
                    break;
                case 'price_desc':
                    query = query.sort({ price: -1 });
                    break;
                case 'newest':
                    query = query.sort({ createdAt: -1 });
                    break;
                case 'rating':
                    query = query.sort({ rating: -1, reviewCount: -1 });
                    break;
                default:
                    const sortBy = req.query.sort.split(',').join(' ');
                    query = query.sort(sortBy);
            }
        } else {
            query = query.sort('-createdAt'); // Default sort
        }

        // 3. Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Product.countDocuments(queryObj);

        query = query.skip(startIndex).limit(limit);
        
        // Execute query
        const products = await query.populate('category', 'name slug');

        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({ 
            success: true, 
            count: products.length, 
            total,
            pagination,
            data: products 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug');

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (!product.isActive) {
            return res.status(403).json({ success: false, message: 'Product is not active' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Invalid product ID' });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check if mainImage was updated and clean up old image
        const oldMainImageId = product.mainImage?.public_id;
        const newMainImageId = req.body.mainImage?.public_id;

        if (newMainImageId && oldMainImageId && oldMainImageId !== newMainImageId) {
            try { await cloudinary.uploader.destroy(oldMainImageId); } catch(e) { console.error('Cloudinary delete error:', e); }
        }

        // Check if additional images were removed and clean them up
        if (req.body.images && product.images) {
            const newImageIds = req.body.images.map(img => img.public_id).filter(id => id);
            const oldImagesToRemove = product.images.filter(img => img.public_id && !newImageIds.includes(img.public_id));
            for (let img of oldImagesToRemove) {
                try { await cloudinary.uploader.destroy(img.public_id); } catch(e) { console.error('Cloudinary delete error:', e); }
            }
        }

        // Update fields individually to trigger hooks if needed, or use findByIdAndUpdate if no hook dependencies on update.
        // We have a pre-save hook for slug, so we should save the document.
        Object.keys(req.body).forEach(key => {
            product[key] = req.body[key];
        });

        await product.save();

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Delete images from Cloudinary
        if (product.mainImage && product.mainImage.public_id) {
            try { await cloudinary.uploader.destroy(product.mainImage.public_id); } catch(e) { console.error('Cloudinary delete error:', e); }
        }
        if (product.images && product.images.length > 0) {
            for (let img of product.images) {
                if (img.public_id) {
                    try { await cloudinary.uploader.destroy(img.public_id); } catch(e) { console.error('Cloudinary delete error:', e); }
                }
            }
        }

        await product.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Invalid product ID' });
    }
};

// @desc    Get all unique lens types
// @route   GET /api/products/lenstypes
// @access  Public
const getLensTypes = async (req, res) => {
    try {
        const lensTypes = await Product.distinct('lensTypes');
        res.status(200).json({ success: true, data: lensTypes.filter(l => l) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getLensTypes
};
