import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cart, loading, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleQuantityChange = async (itemId, currentQty, amount) => {
        const newQty = currentQty + amount;
        if (newQty < 1) return;
        await updateQuantity(itemId, newQty);
    };

    if (loading) return <div className="loading-spinner">Loading cart...</div>;

    if (!cart?.items?.length) {
        return (
            <div className="cart-page container empty-cart">
                <h2>Your Shopping Cart is Empty</h2>
                <p>Looks like you haven't added any eyewear to your cart yet.</p>
                <Link to="/products" className="btn-primary" style={{marginTop: '2rem'}}>
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page container fade-in">
            <h1>Shopping Cart</h1>
            
            <div className="cart-layout">
                <div className="cart-items-section">
                    <div className="cart-header">
                        <span>Product</span>
                        <span>Quantity</span>
                        <span>Total</span>
                    </div>

                    <div className="cart-items-list">
                        {cart.items.map(item => (
                            <div key={item._id} className="cart-item">
                                <div className="item-product-info">
                                    <Link to={`/products/${item.product}`}>
                                        <img src={item.image} alt={item.name} className="item-image" />
                                    </Link>
                                    <div className="item-details">
                                        <Link to={`/products/${item.product}`} className="item-name">
                                            {item.name}
                                        </Link>
                                        <span className="item-price">${item.price.toFixed(2)}</span>
                                        <button 
                                            className="item-remove-btn"
                                            onClick={() => removeFromCart(item.product)}
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="item-quantity-control">
                                    <button 
                                        className="qty-btn"
                                        onClick={() => handleQuantityChange(item.product, item.quantity, -1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button 
                                        className="qty-btn"
                                        onClick={() => handleQuantityChange(item.product, item.quantity, 1)}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                <div className="item-total">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-actions-bottom">
                        <button className="btn-secondary clear-cart-btn" onClick={clearCart}>
                            Clear Cart
                        </button>
                        <Link to="/products" className="continue-shopping-link">
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                <div className="cart-summary-section">
                    <h3>Order Summary</h3>
                    
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${cart.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-row summary-total">
                        <span>Total</span>
                        <span>${cart.totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <button 
                        className="btn-primary checkout-btn"
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
