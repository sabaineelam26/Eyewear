import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist, loading, removeFromWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = async (product) => {
        await addToCart(product._id, 1);
        await removeFromWishlist(product._id);
    };

    if (loading) return <div className="loading-spinner">Loading wishlist...</div>;

    if (!wishlist?.products?.length) {
        return (
            <div className="wishlist-page container empty-wishlist">
                <h2>Your Wishlist is Empty</h2>
                <p>Save items you love here to easily find them later.</p>
                <Link to="/products" className="btn-primary" style={{marginTop: '2rem'}}>
                    Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div className="wishlist-page container fade-in">
            <h1>My Wishlist</h1>
            
            <div className="wishlist-grid">
                {wishlist.products.map(product => (
                    <div key={product._id} className="wishlist-card">
                        <Link to={`/products/${product._id}`} className="wishlist-image-container">
                            <img 
                                src={product.mainImage?.url || 'https://via.placeholder.com/300'} 
                                alt={product.name} 
                                className="wishlist-image"
                            />
                        </Link>
                        
                        <div className="wishlist-info">
                            <Link to={`/products/${product._id}`} className="wishlist-name">
                                {product.name}
                            </Link>
                            
                            <div className="wishlist-price">
                                {product.discountPrice ? (
                                    <>
                                        <span className="price-discount">${product.discountPrice.toFixed(2)}</span>
                                        <span className="price-original">${product.price.toFixed(2)}</span>
                                    </>
                                ) : (
                                    <span className="price-regular">${product.price.toFixed(2)}</span>
                                )}
                            </div>
                            
                            <div className="wishlist-actions">
                                <button 
                                    className="btn-primary wishlist-add-cart"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.stock === 0}
                                >
                                    <ShoppingBag size={16} /> Add to Cart
                                </button>
                                
                                <button 
                                    className="btn-secondary wishlist-remove"
                                    onClick={() => removeFromWishlist(product._id)}
                                    title="Remove from wishlist"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
