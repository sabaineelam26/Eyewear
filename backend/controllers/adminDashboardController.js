const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const [
            totalProducts,
            totalOrders,
            totalCustomers,
            orders,
            lowStockProducts,
            recentOrders
        ] = await Promise.all([
            Product.countDocuments(),
            Order.countDocuments(),
            User.countDocuments({ role: 'customer' }),
            Order.find(),
            Product.find({ stock: { $lt: 10 } }).select('name stock price mainImage').limit(10),
            Order.find().sort('-createdAt').limit(5).populate('user', 'name email')
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalOrders,
                totalCustomers,
                totalRevenue,
                lowStockProducts,
                recentOrders
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardStats };
