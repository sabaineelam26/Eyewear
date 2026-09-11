const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        maxLength: [100, 'Name cannot be more than 100 characters']
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxLength: [2000, 'Description cannot be more than 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: [0, 'Price must be a positive number']
    },
    discountPrice: {
        type: Number,
        min: [0, 'Discount price must be a positive number']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please select a category']
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand'],
        trim: true
    },
    frameShape: {
        type: String,
        enum: ['Round', 'Square', 'Rectangle', 'Oval', 'Cat-Eye', 'Aviator']
    },
    frameColor: {
        type: String,
        trim: true
    },
    frameMaterial: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Unisex', 'Kids']
    },
    size: {
        type: String,
        trim: true
    },
    lensTypes: [{
        type: String,
        enum: ['Clear', 'Blue Light', 'Prescription', 'Sunglasses']
    }],
    mainImage: {
        url: { type: String, required: [true, 'Main image URL is required'] },
        public_id: { type: String, required: [true, 'Main image public ID is required'] }
    },
    images: [{
        url: { type: String },
        public_id: { type: String }
    }],
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    rating: {
        type: Number,
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating cannot be more than 5'],
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create slug from name before saving
productSchema.pre('save', function() {
    if (this.isModified('name')) {
        const baseSlug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        // For products, names might be identical, so we append a random string to ensure unique slug
        // In a real app we might check the DB, but this is a simple reliable way
        const uniqueId = Math.floor(Math.random() * 100000).toString();
        this.slug = `${baseSlug}-${uniqueId}`;
    }
});

module.exports = mongoose.model('Product', productSchema);
