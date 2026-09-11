const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

const { protectAdmin } = require('../middleware/adminMiddleware');

router.route('/')
    .get(getCategories)
    .post(protectAdmin, createCategory);

router.route('/:id')
    .get(getCategoryById)
    .put(protectAdmin, updateCategory)
    .delete(protectAdmin, deleteCategory);

module.exports = router;
