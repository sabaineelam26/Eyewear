import React from 'react';
import ProductForm from './ProductForm';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddProduct = () => {
    return (
        <div className="admin-page fade-in">
            <Link to="/admin/products" className="back-link" style={{ marginBottom: '1.5rem' }}>
                <ChevronLeft size={16} /> Back to Products
            </Link>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Add New Product</h1>
            <ProductForm isEdit={false} />
        </div>
    );
};

export default AddProduct;
