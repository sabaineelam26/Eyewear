import React, { useEffect, useState } from 'react';
import { adminApi } from '../../context/AdminAuthContext';
import { Edit, Trash2, Plus } from 'lucide-react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', description: '', isActive: true });

    const fetchCategories = async () => {
        try {
            const { data } = await adminApi.get('/categories');
            setCategories(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await adminApi.delete(`/categories/${id}`);
                setCategories(categories.filter(c => c._id !== id));
            } catch (error) {
                alert(error.response?.data?.message || 'Delete failed');
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentCategory._id) {
                await adminApi.put(`/categories/${currentCategory._id}`, currentCategory);
            } else {
                await adminApi.post('/categories', currentCategory);
            }
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || 'Save failed');
        }
    };

    if (loading) return <div>Loading categories...</div>;

    return (
        <div className="admin-page fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Categories Management</h1>
                <button 
                    onClick={() => { setCurrentCategory({ name: '', description: '', isActive: true }); setShowModal(true); }}
                    className="btn-primary" 
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                >
                    <Plus size={16} /> Add Category
                </button>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat._id}>
                                    <td style={{ fontWeight: 500 }}>{cat.name}</td>
                                    <td>{cat.slug}</td>
                                    <td>
                                        <span className={`status-badge ${cat.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                                            {cat.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                onClick={() => { setCurrentCategory(cat); setShowModal(true); }} 
                                                className="btn-secondary" style={{ padding: '0.3rem', borderRadius: '4px' }}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cat._id)} 
                                                className="btn-secondary" style={{ padding: '0.3rem', borderRadius: '4px', color: 'var(--error-color)', borderColor: 'var(--error-color)' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Simple Inline Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{currentCategory._id ? 'Edit Category' : 'Add Category'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label>Name</label>
                                <input type="text" className="form-input" required value={currentCategory.name} onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label>Description</label>
                                <textarea className="form-input" value={currentCategory.description} onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}></textarea>
                            </div>
                            <div className="form-group" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" id="isActive" checked={currentCategory.isActive} onChange={(e) => setCurrentCategory({...currentCategory, isActive: e.target.checked})} />
                                <label htmlFor="isActive">Active (Visible to customers)</label>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Save Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
