const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5']
    },
    comment: {
        type: String,
        required: [true, 'Please add a review comment'],
        trim: true,
        maxLength: [1000, 'Comment cannot exceed 1000 characters']
    }
}, {
    timestamps: true
});

// Prevent user from submitting more than one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function (productId) {
    const obj = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    try {
        if (obj[0]) {
            await this.model('Product').findByIdAndUpdate(productId, {
                rating: Math.round(obj[0].averageRating * 10) / 10,
                reviewCount: obj[0].reviewCount
            });
        } else {
            await this.model('Product').findByIdAndUpdate(productId, {
                rating: 0,
                reviewCount: 0
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.product);
});

// Call getAverageRating before remove
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await doc.constructor.getAverageRating(doc.product);
    }
});

module.exports = mongoose.model('Review', reviewSchema);
