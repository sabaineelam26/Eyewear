import React from 'react';
import '../context/Toast.css'; // Has skeleton animations

const ProductCardSkeleton = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
            {/* Image Placeholder */}
            <div className="skeleton" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '4px' }}></div>
            
            {/* Brand/Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="skeleton" style={{ height: '14px', width: '40%' }}></div>
                <div className="skeleton" style={{ height: '20px', width: '80%' }}></div>
            </div>
            
            {/* Price */}
            <div className="skeleton" style={{ height: '24px', width: '50%', marginTop: '0.5rem' }}></div>
            
            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                <div className="skeleton" style={{ height: '40px', flex: 1, borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ height: '40px', width: '40px', borderRadius: '4px' }}></div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
