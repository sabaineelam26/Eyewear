import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductForm from './ProductForm';
import { fetchAdminProductById } from '../../services/adminService';
import { ChevronLeft } from 'lucide-react';

const EditProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await fetchAdminProductById(id);
                setProduct(data.data);
            } catch (err) {
                setError('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) return <div className="admin-content">Loading product details...</div>;
    if (error) return <div className="admin-content error-message">{error}</div>;

    return (
        <div className="admin-page fade-in">
            <Link to="/admin/products" className="back-link" style={{ marginBottom: '1.5rem' }}>
                <ChevronLeft size={16} /> Back to Products
            </Link>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Edit Product</h1>
            {product && <ProductForm isEdit={true} initialData={product} />}
        </div>
    );
};

export default EditProduct;
