const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getLensTypes
} = require('../controllers/productController');
const { getReviews, createReview } = require('../controllers/reviewController');
const { protectAdmin } = require('../middleware/adminMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.route('/lenstypes')
    .get(getLensTypes);

router.route('/')
    .get(getProducts)
    .post(protectAdmin, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protectAdmin, updateProduct)
    .delete(protectAdmin, deleteProduct);

// Reviews
router.get('/:productId/reviews', getReviews);
router.post('/:productId/reviews', protect, createReview);

module.exports = router;
