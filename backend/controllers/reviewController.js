const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort('-createdAt');
            
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a review
// @route   POST /api/products/:productId/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;
        const userId = req.user.id;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check if user already reviewed
        const alreadyReviewed = await Review.findOne({ product: productId, user: userId });
        if (alreadyReviewed) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
        }

        // Verify purchase
        // Search orders for this user that contain the product ID and are not cancelled
        const orders = await Order.find({ 
            user: userId,
            orderStatus: { $ne: 'Cancelled' }
        });

        const hasPurchased = orders.some(order => 
            order.orderItems.some(item => item.product.toString() === productId)
        );

        if (!hasPurchased) {
            return res.status(403).json({ success: false, message: 'You must purchase this product before reviewing it' });
        }

        // Create review
        const review = await Review.create({
            product: productId,
            user: userId,
            rating: Number(rating),
            comment
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Make sure user owns the review
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this review' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        await review.save(); // This triggers the getAverageRating middleware

        res.status(200).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Make sure user owns the review or is an admin (optional, let's just stick to user for now)
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this review' });
        }

        await Review.findByIdAndDelete(req.params.id); // Using findByIdAndDelete to trigger the post findOneAndDelete middleware

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getReviews,
    createReview,
    updateReview,
    deleteReview
};
