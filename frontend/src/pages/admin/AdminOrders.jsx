import React, { useEffect, useState } from 'react';
import { Eye, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAdminOrders } from '../../services/adminService';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const loadOrders = async () => {
        try {
            const data = await fetchAdminOrders();
            setOrders(data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            order._id.toLowerCase().includes(searchLower) || 
            (order.user?.name && order.user.name.toLowerCase().includes(searchLower));
        
        const matchesStatus = statusFilter ? order.orderStatus === statusFilter : true;
        
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="admin-content">Loading orders...</div>;

    const statuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <div className="admin-page fade-in">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Orders Management</h1>

            <div className="admin-card">
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input 
                            type="text" 
                            placeholder="Search by Order ID or Customer Name..." 
                            className="form-input" 
                            style={{ paddingLeft: '2.5rem', margin: 0 }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={18} color="var(--text-secondary)" />
                        <select 
                            className="form-input" 
                            style={{ margin: 0, width: '200px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order._id}>
                                    <td className="monospace-id">#{order._id.substring(order._id.length - 8)}</td>
                                    <td style={{ fontWeight: 500 }}>
                                        {order.user?.name || 'Guest'}
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                                            {order.user?.email || 'N/A'}
                                        </div>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>${order.totalAmount.toFixed(2)}</td>
                                    <td>
                                        <span style={{ fontSize: '0.85rem', color: order.paymentStatus === 'Paid' ? 'var(--success-color)' : 'var(--text-secondary)' }}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <Link to={`/admin/orders/${order._id}`} className="btn-secondary" style={{ padding: '0.3rem', borderRadius: '4px', display: 'inline-block' }}>
                                            <Eye size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
