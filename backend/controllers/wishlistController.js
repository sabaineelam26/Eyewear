const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private/Customer
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
        
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user.id, products: [] });
            return res.status(200).json({ success: true, data: wishlist });
        }

        // Filter out unavailable products dynamically before returning
        const availableProducts = wishlist.products.filter(p => p && p.isActive);
        
        // If the array changed because products were deleted or made inactive, we can optionally update the DB
        if (availableProducts.length !== wishlist.products.length) {
            wishlist.products = availableProducts.map(p => p._id);
            await wishlist.save();
        }

        wishlist.products = availableProducts;
        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private/Customer
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
        }

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user.id, products: [] });
        }

        // Prevent duplicate
        if (wishlist.products.includes(productId)) {
            return res.status(400).json({ success: false, message: 'Product already in wishlist' });
        }

        wishlist.products.push(productId);
        await wishlist.save();

        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private/Customer
const removeFromWishlist = async (req, res) => {
    try {
        const productId = req.params.productId;

        let wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist not found' });
        }

        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        await wishlist.save();

        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
