import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '../services/api';
import './Order.css';

const OrderConfirmation = () => {
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

    if (loading) return <div className="loading-spinner">Loading...</div>;
    
    if (!order) return <div className="container" style={{marginTop: '4rem'}}>Order not found</div>;

    return (
        <div className="confirmation-page container fade-in">
            <div className="confirmation-header">
                <CheckCircle size={64} color="var(--success-color)" strokeWidth={1.5} />
                <h1>Order Confirmed!</h1>
                <p>Thank you for your purchase. Your order has been received and is being processed.</p>
                <div className="order-id-badge">Order #{order._id}</div>
            </div>

            <div className="confirmation-actions">
                <Link to="/orders" className="btn-secondary">VIEW MY ORDERS</Link>
                <Link to="/products" className="btn-primary">CONTINUE SHOPPING</Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
