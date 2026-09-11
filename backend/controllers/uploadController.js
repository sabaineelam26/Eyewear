const cloudinary = require('../utils/cloudinary');

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please provide an image file' });
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
        const folder = req.body.folder || 'eyewear_products';

        const result = await cloudinary.uploader.upload(dataURI, { folder });

        res.status(200).json({
            success: true,
            data: {
                url: result.secure_url,
                public_id: result.public_id
            }
        });
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Image upload failed' });
    }
};

// @desc    Delete an image
// @route   DELETE /api/upload
// @access  Private/Admin
const deleteImage = async (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({ success: false, message: 'Please provide public_id' });
        }

        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === 'ok' || result.result === 'not found') {
            res.status(200).json({ success: true, message: 'Image deleted successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Image could not be deleted' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    uploadImage,
    deleteImage
};
