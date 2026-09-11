const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protectAdmin } = require('../middleware/adminMiddleware');

// Handle single image upload for now
router.route('/')
    .post(protectAdmin, upload.single('image'), uploadImage)
    .delete(protectAdmin, deleteImage);

module.exports = router;
