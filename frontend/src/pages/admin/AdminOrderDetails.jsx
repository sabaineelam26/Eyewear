import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { fetchAdminOrderDetails, updateOrderStatus } from '../../services/adminService';
import './Admin.css';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    
    // Status state
    const [status, setStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [message, setMessage] = useState('');

    const loadOrder = async () => {
        try {
            const { data } = await fetchAdminOrderDetails(id);
            setOrder(data);
            setStatus(data.orderStatus);
            setPaymentStatus(data.paymentStatus);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrder();
    }, [id]);

    const handleUpdateStatus = async () => {
        setUpdating(true);
        setMessage('');
        try {
            const { data } = await updateOrderStatus(id, { orderStatus: status, paymentStatus });
            setOrder(data);
            setMessage('Order updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to update order');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="admin-content">Loading order details...</div>;
    if (!order) return <div className="admin-content error-message">Order not found</div>;

    const allStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    const allPaymentStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];

    return (
        <div className="admin-page fade-in">
            <Link to="/admin/orders" className="back-link" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <ChevronLeft size={16} /> Back to Orders
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Order <span className="monospace-id">#{order._id}</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="admin-card" style={{ margin: 0, padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Order Status</label>
                            <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)} style={{ margin: 0, width: '150px' }}>
                                {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Payment Status</label>
                            <select className="form-input" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} style={{ margin: 0, width: '150px' }}>
                                {allPaymentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <button className="btn-primary" onClick={handleUpdateStatus} disabled={updating || (status === order.orderStatus && paymentStatus === order.paymentStatus)} style={{ marginTop: '1.25rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Save size={16} /> {updating ? 'Saving...' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>

            {message && (
                <div style={{ padding: '1rem', marginBottom: '2rem', borderRadius: '4px', backgroundColor: message.includes('success') ? 'var(--success-color)' : 'var(--error-color)', color: 'white' }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Left Col: Items & Customer */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="admin-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Ordered Products</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {order.orderItems.map(item => (
                                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500, fontSize: '1rem' }}>{item.name}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Qty: {item.quantity}</div>
                                    </div>
                                    <div style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                        
                        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--admin-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', width: '200px', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Subtotal:</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', width: '200px', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Shipping:</span>
                                <span>${order.shippingCost.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', width: '200px', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.5rem' }}>
                                <span>Total:</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Info Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="admin-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Customer Information</h3>
                        <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{order.user?.name || 'Guest'}</p>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{order.user?.email || 'N/A'}</p>
                        <p style={{ color: 'var(--text-secondary)' }}>{order.user?.phone || 'No phone provided'}</p>
                    </div>

                    <div className="admin-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Shipping Address</h3>
                        <p style={{ marginBottom: '0.25rem' }}>{order.shippingAddress.address}</p>
                        <p style={{ marginBottom: '0.25rem' }}>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
