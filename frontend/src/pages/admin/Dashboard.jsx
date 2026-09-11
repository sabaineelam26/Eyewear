import React, { useEffect, useState } from 'react';
import { adminApi } from '../../context/AdminAuthContext';
import './Admin.css';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await adminApi.get('/admin/dashboard');
                setStats(data.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard data...</div>;
    if (!stats) return <div>Error loading stats</div>;

    return (
        <div className="admin-dashboard fade-in">
            <div className="dashboard-metrics">
                <div className="metric-card">
                    <div className="metric-title">Total Revenue</div>
                    <div className="metric-value">${stats.totalRevenue.toFixed(2)}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-title">Orders</div>
                    <div className="metric-value">{stats.totalOrders}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-title">Customers</div>
                    <div className="metric-value">{stats.totalCustomers}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-title">Products</div>
                    <div className="metric-value">{stats.totalProducts}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>Recent Orders</h3>
                    </div>
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map(order => (
                                    <tr key={order._id}>
                                        <td>#{order._id.substring(order._id.length - 6)}</td>
                                        <td>{order.user?.name || 'Unknown'}</td>
                                        <td><span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></td>
                                        <td>${order.totalAmount.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {stats.recentOrders.length === 0 && (
                                    <tr><td colSpan="4" style={{textAlign: 'center'}}>No recent orders</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>Low Stock Alerts</h3>
                    </div>
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Name</th>
                                    <th>Stock</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.lowStockProducts.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            <img src={product.mainImage?.url} alt={product.name} className="admin-table-img" />
                                        </td>
                                        <td>{product.name}</td>
                                        <td style={{ color: product.stock === 0 ? 'var(--error-color)' : '#f59e0b', fontWeight: 'bold' }}>
                                            {product.stock} left
                                        </td>
                                        <td>${product.price.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {stats.lowStockProducts.length === 0 && (
                                    <tr><td colSpan="4" style={{textAlign: 'center'}}>Inventory healthy</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
