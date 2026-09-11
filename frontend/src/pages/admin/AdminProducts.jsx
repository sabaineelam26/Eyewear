import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import { fetchAdminProducts, deleteProduct, fetchAdminCategories } from '../../services/adminService';
import './Admin.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetchAdminProducts(),
                fetchAdminCategories()
            ]);
            setProducts(prodRes.data || []);
            setCategories(catRes.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you SURE you want to delete this product? This action cannot be undone.')) {
            try {
                await deleteProduct(id);
                setProducts(products.filter(p => p._id !== id));
            } catch (error) {
                alert(error.response?.data?.message || 'Delete failed');
            }
        }
    };

    // Client-side filtering as fallback if backend search isn't perfect
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = categoryFilter ? (p.category?._id === categoryFilter || p.category === categoryFilter) : true;
        return matchesSearch && matchesCat;
    });

    if (loading) return <div className="admin-content">Loading products...</div>;

    return (
        <div className="admin-page fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Products Management</h1>
                <Link to="/admin/products/add" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            <div className="admin-card">
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
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
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        <img src={product.mainImage?.url || 'https://via.placeholder.com/40'} alt={product.name} className="admin-table-img" />
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                                    <td>{product.category?.name || 'Uncategorized'}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>
                                        <span style={{ color: product.stock < 10 ? 'var(--error-color)' : 'inherit', fontWeight: product.stock < 10 ? 'bold' : 'normal' }}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${product.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                                            {product.isActive ? 'Active' : 'Draft'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link to={`/admin/products/edit/${product._id}`} className="btn-secondary" style={{ padding: '0.3rem', borderRadius: '4px' }}>
                                                <Edit size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(product._id)} className="btn-secondary" style={{ padding: '0.3rem', borderRadius: '4px', color: 'var(--error-color)', borderColor: 'var(--error-color)' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No products match your search.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
