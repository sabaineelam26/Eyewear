const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Customer
const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        if (!shippingAddress || !shippingAddress.address) {
            return res.status(400).json({ success: false, message: 'Shipping address is required' });
        }

        // 1. Fetch the user's cart
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in cart to place order' });
        }

        // 2. Validate product availability and recalculate prices
        let subtotal = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            
            if (!product || !product.isActive) {
                return res.status(400).json({ success: false, message: `Product ${item.name} is no longer available` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Not enough stock for ${item.name}. Only ${product.stock} left.` });
            }

            const currentPrice = product.discountPrice ? product.discountPrice : product.price;
            subtotal += (currentPrice * item.quantity);

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.mainImage?.url || 'https://via.placeholder.com/150',
                price: currentPrice,
                quantity: item.quantity
            });
        }

        // 3. Calculate shipping & totals
        const shippingCost = subtotal > 100 ? 0 : 15.0; // Example rule: Free shipping over $100
        const discount = 0; // Discount logic can be added later
        const totalAmount = subtotal + shippingCost - discount;

        // 4. Create the order
        const order = new Order({
            user: req.user.id,
            orderItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            subtotal,
            shippingCost,
            discount,
            totalAmount
        });

        await order.save();

        // 5. Reduce product stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            product.stock -= item.quantity;
            await product.save();
        }

        // 6. Clear the cart
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private/Customer
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Customer
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Ensure user can only view their own order
        if (order.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById
};
