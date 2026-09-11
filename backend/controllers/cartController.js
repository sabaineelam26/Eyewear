const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to calculate total price
const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private/Customer
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [], totalPrice: 0 });
        }
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private/Customer
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const qty = Number(quantity) || 1;

        const product = await Product.findById(productId);

        if (!product || !product.isActive) {
            return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
        }

        if (product.stock < qty) {
            return res.status(400).json({ success: false, message: 'Not enough stock available' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

        if (itemIndex > -1) {
            // Product exists in cart, update quantity
            let item = cart.items[itemIndex];
            if (product.stock < item.quantity + qty) {
                return res.status(400).json({ success: false, message: 'Not enough stock available to add more' });
            }
            item.quantity += qty;
        } else {
            // New product, add to cart items array
            const price = product.discountPrice ? product.discountPrice : product.price;
            cart.items.push({
                product: product._id,
                name: product.name,
                image: product.mainImage?.url || 'https://via.placeholder.com/150',
                price: price,
                quantity: qty
            });
        }

        cart.totalPrice = calculateTotal(cart.items);
        await cart.save();

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private/Customer
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const qty = Number(quantity);
        const itemId = req.params.itemId; // This is the Product ID within the cart

        if (qty < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(p => p.product.toString() === itemId);

        if (itemIndex > -1) {
            const product = await Product.findById(itemId);
            if (!product || !product.isActive) {
                return res.status(404).json({ success: false, message: 'Product no longer available' });
            }
            if (product.stock < qty) {
                return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
            }

            cart.items[itemIndex].quantity = qty;
            cart.totalPrice = calculateTotal(cart.items);
            await cart.save();
            res.status(200).json({ success: true, data: cart });
        } else {
            res.status(404).json({ success: false, message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private/Customer
const removeCartItem = async (req, res) => {
    try {
        const itemId = req.params.itemId; // Product ID

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== itemId);
        cart.totalPrice = calculateTotal(cart.items);
        await cart.save();

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private/Customer
const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};
