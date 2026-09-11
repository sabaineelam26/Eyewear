import React, { useEffect, useState } from 'react';
import { fetchAdminProducts, updateProductStock } from '../../services/adminService';
import { Search, AlertTriangle } from 'lucide-react';
import './Admin.css';

const AdminInventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingStock, setEditingStock] = useState(null); // stores { id, newStock }
    const [stockFilter, setStockFilter] = useState('all'); // all, low, out

    const loadProducts = async () => {
        try {
            const { data } = await fetchAdminProducts();
            setProducts(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleStockUpdate = async (id) => {
        if (!editingStock || editingStock.id !== id) return;
        
        try {
            await updateProductStock(id, { stock: editingStock.newStock });
            // Update local state
            setProducts(products.map(p => p._id === id ? { ...p, stock: editingStock.newStock } : p));
            setEditingStock(null); // clear edit mode
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update stock');
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesStock = true;
        if (stockFilter === 'low') matchesStock = p.stock > 0 && p.stock < 10;
        if (stockFilter === 'out') matchesStock = p.stock === 0;
        
        return matchesSearch && matchesStock;
    });

    if (loading) return <div className="admin-content">Loading inventory...</div>;

    const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    return (
        <div className="admin-page fade-in">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Inventory Control</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="metric-card" style={{ borderLeft: '4px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div className="metric-title">Low Stock (&lt; 10)</div>
                        <div className="metric-value" style={{ color: '#f59e0b' }}>{lowStockCount}</div>
                    </div>
                    <AlertTriangle size={32} color="#f59e0b" style={{ opacity: 0.5 }} />
                </div>
                <div className="metric-card" style={{ borderLeft: '4px solid var(--error-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div className="metric-title">Out of Stock</div>
                        <div className="metric-value" style={{ color: 'var(--error-color)' }}>{outOfStockCount}</div>
                    </div>
                    <AlertTriangle size={32} color="var(--error-color)" style={{ opacity: 0.5 }} />
                </div>
            </div>

            <div className="admin-card">
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input 
                            type="text" 
                            placeholder="Search inventory..." 
                            className="form-input" 
                            style={{ paddingLeft: '2.5rem', margin: 0 }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <select 
                            className="form-input" 
                            style={{ margin: 0, width: '200px' }}
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                        >
                            <option value="all">All Inventory</option>
                            <option value="low">Low Stock Only</option>
                            <option value="out">Out of Stock Only</option>
                        </select>
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Current Stock</th>
                                <th>Quick Update</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => {
                                const isLowStock = product.stock > 0 && product.stock < 10;
                                const isOutOfStock = product.stock === 0;
                                const isEditing = editingStock?.id === product._id;

                                return (
                                <tr key={product._id} style={{ backgroundColor: isOutOfStock ? '#fee2e2' : isLowStock ? '#fef3c7' : 'transparent' }}>
                                    <td style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src={product.mainImage?.url} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                        {product.name}
                                    </td>
                                    <td>{product.category?.name || 'Uncategorized'}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td style={{ fontWeight: 'bold', color: isOutOfStock ? 'var(--error-color)' : isLowStock ? '#d97706' : 'inherit' }}>
                                        {product.stock}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input 
                                                type="number" 
                                                className="form-input" 
                                                style={{ width: '80px', margin: 0, padding: '0.3rem', fontSize: '0.9rem' }} 
                                                min="0"
                                                value={isEditing ? editingStock.newStock : product.stock}
                                                onChange={(e) => setEditingStock({ id: product._id, newStock: parseInt(e.target.value) || 0 })}
                                            />
                                            {isEditing && (
                                                <button onClick={() => handleStockUpdate(product._id)} className="btn-primary" style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}>
                                                    Save
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {isOutOfStock ? (
                                            <span style={{ color: 'var(--error-color)', fontWeight: 600, fontSize: '0.85rem' }}>OUT OF STOCK</span>
                                        ) : isLowStock ? (
                                            <span style={{ color: '#d97706', fontWeight: 600, fontSize: '0.85rem' }}>LOW STOCK</span>
                                        ) : (
                                            <span style={{ color: 'var(--success-color)', fontWeight: 600, fontSize: '0.85rem' }}>IN STOCK</span>
                                        )}
                                    </td>
                                </tr>
                            )})}
                            {filteredProducts.length === 0 && (
                                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No products match your inventory filter.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminInventory;
