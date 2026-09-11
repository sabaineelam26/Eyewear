import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../services/api';
import './Order.css';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div className="loading-spinner">Loading order details...</div>;
    if (!order) return <div className="container" style={{marginTop: '4rem'}}>Order not found.</div>;

    return (
        <div className="order-details-page container fade-in">
            <Link to="/orders" className="back-link">
                <ChevronLeft size={16} /> Back to My Orders
            </Link>
            
            <div className="order-details-header">
                <h1>Order #{order._id}</h1>
                <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
            </div>
            <p className="order-date">Placed on {new Date(order.createdAt).toLocaleString()}</p>

            <div className="order-details-layout">
                <div className="order-items-list">
                    <div className="checkout-card">
                        <h2>Items in this order</h2>
                        {order.orderItems.map(item => (
                            <div key={item._id} className="order-detail-item">
                                <img src={item.image} alt={item.name} />
                                <div className="order-detail-info">
                                    <Link to={`/products/${item.product}`} className="name">{item.name}</Link>
                                    <span className="price">${item.price.toFixed(2)} x {item.quantity}</span>
                                </div>
                                <div className="order-detail-total">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="order-info-sidebar">
                    <div className="checkout-card">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>${order.shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="checkout-card">
                        <h2>Shipping Info</h2>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                    </div>

                    <div className="checkout-card">
                        <h2>Payment Info</h2>
                        <p><strong>Method:</strong> {order.paymentMethod}</p>
                        <p><strong>Status:</strong> {order.paymentStatus}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
