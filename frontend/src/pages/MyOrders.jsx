import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Order.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders');
                setOrders(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="loading-spinner">Loading orders...</div>;

    return (
        <div className="my-orders-page container fade-in">
            <h1>My Orders</h1>
            
            {orders.length === 0 ? (
                <div className="empty-orders">
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/products" className="btn-primary" style={{marginTop: '1rem'}}>Start Shopping</Link>
                </div>
            ) : (
                <div className="orders-table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td className="monospace-id">#{order._id.substring(order._id.length - 8)}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>${order.totalAmount.toFixed(2)}</td>
                                    <td>
                                        <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <Link to={`/orders/${order._id}`} className="view-details-link">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
