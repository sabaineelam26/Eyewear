import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminCategories, uploadImage, createProduct, updateProduct } from '../../services/adminService';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import './Admin.css';

const ProductForm = ({ initialData, isEdit }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const multiFileInputRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [lensOptions, setLensOptions] = useState([]);
    
    // UI States
    const [loading, setLoading] = useState(false);
    const [uploadingMain, setUploadingMain] = useState(false);
    const [uploadingAdditional, setUploadingAdditional] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        category: '',
        brand: '',
        frameShape: '',
        frameColor: '',
        frameMaterial: '',
        gender: '',
        size: '',
        lensTypes: [],
        stock: 0,
        isFeatured: false,
        isActive: true,
        mainImage: null, // { url, public_id }
        images: []
    });

    const shapeOptions = ['Round', 'Square', 'Rectangle', 'Oval', 'Cat-Eye', 'Aviator'];
    const genderOptions = ['Men', 'Women', 'Unisex', 'Kids'];

    useEffect(() => {
        fetchAdminCategories().then(res => setCategories(res.data)).catch(console.error);
        
        // Use a direct fetch or custom API helper
        fetch('http://localhost:5000/api/products/lenstypes')
            .then(res => res.json())
            .then(res => {
                if (res.success && res.data.length > 0) {
                    setLensOptions(res.data);
                } else {
                    setLensOptions(['Clear', 'Blue Light', 'Prescription', 'Sunglasses']); // Fallback
                }
            })
            .catch(() => setLensOptions(['Clear', 'Blue Light', 'Prescription', 'Sunglasses']));

        if (initialData) {
            setFormData({
                ...formData,
                ...initialData,
                category: initialData.category?._id || initialData.category, // Handle populated category
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLensTypeToggle = (lens) => {
        setFormData(prev => {
            const current = [...prev.lensTypes];
            if (current.includes(lens)) return { ...prev, lensTypes: current.filter(l => l !== lens) };
            return { ...prev, lensTypes: [...current, lens] };
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingMain(true);
        setError('');
        try {
            const res = await uploadImage(file);
            setFormData(prev => ({ ...prev, mainImage: res.data }));
            setSuccess('Main image uploaded!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Image upload failed');
        } finally {
            setUploadingMain(false);
        }
    };

    const handleAdditionalImagesUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingAdditional(true);
        setError('');
        
        try {
            const uploadPromises = files.map(file => uploadImage(file));
            const results = await Promise.all(uploadPromises);
            
            const newImages = results.map(res => res.data);
            
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
            
            setSuccess(`${files.length} image(s) uploaded successfully!`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to upload some or all additional images');
        } finally {
            setUploadingAdditional(false);
        }
    };

    const removeAdditionalImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!formData.mainImage) {
            setError('Main image is required.');
            setLoading(false);
            return;
        }

        try {
            if (isEdit) {
                await updateProduct(initialData._id, formData);
                setSuccess('Product updated successfully!');
            } else {
                await createProduct(formData);
                setSuccess('Product created successfully!');
            }
            setTimeout(() => {
                navigate('/admin/products');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-card fade-in" style={{ padding: '2rem' }}>
            {error && <div className="error-message" style={{ marginBottom: '2rem' }}>{error}</div>}
            {success && <div className="success-message" style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--success-color)', color: 'white', borderRadius: '4px' }}>{success}</div>}
            
            <div style={{ display: 'flex', gap: '3rem' }}>
                {/* Left Column: Form Fields */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>Basic Details</h3>
                    
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleChange} />
                    </div>
                    
                    <div className="form-group">
                        <label>Description *</label>
                        <textarea name="description" className="form-input" rows="4" required value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Price ($) *</label>
                            <input type="number" name="price" className="form-input" required min="0" step="0.01" value={formData.price} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Discount Price ($)</label>
                            <input type="number" name="discountPrice" className="form-input" min="0" step="0.01" value={formData.discountPrice} onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Category *</label>
                            <select name="category" className="form-input" required value={formData.category} onChange={handleChange}>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Brand *</label>
                            <input type="text" name="brand" className="form-input" required value={formData.brand} onChange={handleChange} />
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem', marginTop: '1rem' }}>Specifications</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Frame Shape</label>
                            <select name="frameShape" className="form-input" value={formData.frameShape} onChange={handleChange}>
                                <option value="">Select Shape</option>
                                {shapeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            <select name="gender" className="form-input" value={formData.gender} onChange={handleChange}>
                                <option value="">Select Gender</option>
                                {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Frame Color</label>
                            <input type="text" name="frameColor" className="form-input" value={formData.frameColor} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Material</label>
                            <input type="text" name="frameMaterial" className="form-input" value={formData.frameMaterial} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Size</label>
                            <input type="text" name="size" className="form-input" placeholder="e.g. 52-18-140" value={formData.size} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Lens Types Supported</label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                            {lensOptions.map(lens => (
                                <label key={lens} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={formData.lensTypes.includes(lens)} 
                                        onChange={() => handleLensTypeToggle(lens)} 
                                    />
                                    {lens}
                                </label>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <input type="text" id="customLensType" placeholder="Add custom lens type" className="form-input" style={{ marginBottom: 0 }} />
                            <button type="button" className="btn-secondary" onClick={() => {
                                const val = document.getElementById('customLensType').value.trim();
                                if (val && !lensOptions.includes(val)) {
                                    setLensOptions([...lensOptions, val]);
                                    handleLensTypeToggle(val);
                                    document.getElementById('customLensType').value = '';
                                }
                            }}>Add</button>
                        </div>
                    </div>

                </div>

                {/* Right Column: Images, Stock, Status */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Main Image *</h3>
                        
                        {formData.mainImage ? (
                            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                <img src={formData.mainImage.url} alt="Main Product" style={{ width: '100%', height: 'auto', borderRadius: '4px', border: '1px solid var(--admin-border)' }} />
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, mainImage: null})}
                                    style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--error-color)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div 
                                onClick={() => fileInputRef.current.click()}
                                style={{ border: '2px dashed var(--admin-primary)', borderRadius: '8px', padding: '3rem 1rem', textAlign: 'center', cursor: 'pointer', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                            >
                                <UploadCloud size={32} color="var(--admin-primary)" style={{ margin: '0 auto 1rem' }} />
                                <p style={{ color: 'var(--admin-primary)', fontWeight: 500 }}>Click to upload image</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>JPG, PNG under 5MB</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                        {uploadingMain && <p style={{ marginTop: '0.5rem', color: 'var(--admin-primary)', fontSize: '0.9rem' }}>Uploading to Cloudinary...</p>}
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Additional Images</h3>
                        
                        {formData.images.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                                {formData.images.map((img, index) => (
                                    <div key={index} style={{ position: 'relative' }}>
                                        <img src={img.url} alt={`Additional ${index}`} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }} />
                                        <button 
                                            type="button"
                                            onClick={() => removeAdditionalImage(index)}
                                            style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'var(--error-color)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div 
                            onClick={() => multiFileInputRef.current.click()}
                            style={{ border: '2px dashed var(--admin-border)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-color)' }}
                        >
                            <ImageIcon size={24} color="var(--text-secondary)" style={{ margin: '0 auto 0.5rem' }} />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Add multiple images</p>
                        </div>
                        <input type="file" ref={multiFileInputRef} style={{ display: 'none' }} accept="image/*" multiple onChange={handleAdditionalImagesUpload} />
                        {uploadingAdditional && <p style={{ marginTop: '0.5rem', color: 'var(--admin-primary)', fontSize: '0.9rem' }}>Uploading images...</p>}
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Inventory & Visibility</h3>
                        
                        <div className="form-group">
                            <label>Stock Quantity *</label>
                            <input type="number" name="stock" className="form-input" required min="0" value={formData.stock} onChange={handleChange} />
                        </div>

                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                            <label htmlFor="isActive" style={{ margin: 0, cursor: 'pointer' }}>Active (Visible to customers)</label>
                        </div>
                        
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                            <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                            <label htmlFor="isFeatured" style={{ margin: 0, cursor: 'pointer' }}>Featured Product (Shows on homepage)</label>
                        </div>
                    </div>

                </div>
            </div>

            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--admin-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading || uploadingMain || uploadingAdditional}>
                    {loading ? 'Saving Product...' : isEdit ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
