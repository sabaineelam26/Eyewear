import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import './Order.css';

const Checkout = () => {
    const { cart, fetchCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (cart && cart.items && cart.items.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const { data } = await api.post('/orders', {
                shippingAddress,
                paymentMethod
            });
            
            // Refresh cart globally (which will now be empty)
            await fetchCart();
            
            // Navigate to order confirmation
            navigate(`/orders/confirmation/${data.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (!cart || !cart.items || cart.items.length === 0) return null;

    const shippingCost = cart.totalPrice > 100 ? 0 : 15;
    const totalAmount = cart.totalPrice + shippingCost;

    return (
        <div className="checkout-page container fade-in">
            <h1>Checkout</h1>
            
            <div className="checkout-layout">
                <div className="checkout-form-section">
                    {error && <div className="error-message">{error}</div>}
                    
                    <form onSubmit={placeOrderHandler} id="checkout-form">
                        <div className="checkout-card">
                            <h2>Shipping Address</h2>
                            <div className="form-group">
                                <label htmlFor="address">Street Address</label>
                                <input type="text" id="address" name="address" className="form-input" required value={shippingAddress.address} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input type="text" id="city" name="city" className="form-input" required value={shippingAddress.city} onChange={handleInputChange} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label htmlFor="postalCode">Postal Code</label>
                                    <input type="text" id="postalCode" name="postalCode" className="form-input" required value={shippingAddress.postalCode} onChange={handleInputChange} />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label htmlFor="country">Country</label>
                                    <input type="text" id="country" name="country" className="form-input" required value={shippingAddress.country} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="checkout-card">
                            <h2>Payment Method</h2>
                            <div className="payment-options">
                                <label className="payment-radio">
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value="Cash on Delivery" 
                                        checked={paymentMethod === 'Cash on Delivery'} 
                                        onChange={(e) => setPaymentMethod(e.target.value)} 
                                    />
                                    <span>Cash on Delivery</span>
                                </label>
                                <label className="payment-radio disabled">
                                    <input type="radio" name="paymentMethod" value="Credit Card" disabled />
                                    <span>Credit Card (Coming Soon)</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="checkout-summary-section">
                    <div className="checkout-card">
                        <h2>Order Summary</h2>
                        <div className="summary-items">
                            {cart.items.map(item => (
                                <div key={item.product} className="summary-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="summary-item-info">
                                        <span className="name">{item.name}</span>
                                        <span className="qty">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="summary-divider"></div>
                        
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${cart.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                        </div>
                        
                        <div className="summary-divider"></div>
                        
                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        
                        <button 
                            type="submit" 
                            form="checkout-form" 
                            className="btn-primary checkout-submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
