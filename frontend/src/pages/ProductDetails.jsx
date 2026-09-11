import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import StarRating from '../components/StarRating';
import ProductReviews from '../components/ProductReviews';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addMessage, setAddMessage] = useState('');
  
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  
  const inWishlist = product ? isInWishlist(product._id) : false;

  const handleWishlistToggle = async () => {
    if (inWishlist) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
        setActiveImage(data.data.mainImage?.url || 'https://via.placeholder.com/600x400?text=No+Image');
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    setAddMessage('');
    const res = await addToCart(product._id, 1);
    setIsAdding(false);
    if (res.success) {
      setAddMessage('Added to cart!');
      setTimeout(() => setAddMessage(''), 3000);
    } else {
      setAddMessage(res.message);
      setTimeout(() => setAddMessage(''), 3000);
    }
  };

  if (loading) return <div className="loading-spinner">Loading product...</div>;
  if (error) return <div className="container error-message" style={{marginTop: '4rem'}}>{error}</div>;
  if (!product) return null;

  return (
    <div className="product-details-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <ChevronRight size={14} />
        <Link to="/products">Products</Link> <ChevronRight size={14} />
        <span>{product.name}</span>
      </div>

      <div className="product-details-container">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="main-image-container">
            <img src={activeImage} alt={product.name} className="main-image fade-in" />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="thumbnail-list">
              <img 
                src={product.mainImage?.url || 'https://via.placeholder.com/600x400'} 
                alt="Thumbnail" 
                className={`thumbnail ${activeImage === product.mainImage?.url ? 'active' : ''}`}
                onClick={() => setActiveImage(product.mainImage?.url)}
              />
              {product.images.map((img, index) => (
                <img 
                  key={index} 
                  src={img.url} 
                  alt={`Thumbnail ${index}`} 
                  className={`thumbnail ${activeImage === img.url ? 'active' : ''}`}
                  onClick={() => setActiveImage(img.url)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info-panel">
          <div className="product-header">
            <span className="product-brand">{product.brand}</span>
            <h1 className="product-name">{product.name}</h1>
            
            <div style={{ marginBottom: '1rem' }}>
              <StarRating rating={product.rating || 0} count={product.reviewCount || 0} />
            </div>
            
            <div className="product-pricing">
              {product.discountPrice ? (
                <>
                  <span className="current-price">${product.discountPrice.toFixed(2)}</span>
                  <span className="original-price">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="current-price">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-specs-summary">
            <div className="spec-item">
              <span className="spec-label">Shape</span>
              <span className="spec-value">{product.frameShape || 'Standard'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Color</span>
              <span className="spec-value">{product.frameColor || 'Standard'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Gender</span>
              <span className="spec-value">{product.gender || 'Unisex'}</span>
            </div>
          </div>

          <div className="stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="product-actions">
            <div style={{display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem'}}>
                <button 
                  className="btn-primary add-to-cart-btn" 
                  disabled={product.stock === 0 || isAdding}
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={20} /> {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>
                {addMessage && <span style={{fontSize: '0.85rem', color: addMessage.includes('Added') ? 'var(--success-color)' : 'var(--error-color)', fontWeight: 500}}>{addMessage}</span>}
            </div>
            <button 
              className="btn-secondary add-to-wishlist-btn"
              onClick={handleWishlistToggle}
            >
              <Heart size={20} fill={inWishlist ? "var(--error-color)" : "none"} color={inWishlist ? "var(--error-color)" : "currentColor"} />
            </button>
          </div>

          <div className="product-features">
            <div className="feature">
              <Truck size={20} strokeWidth={1.5} />
              <span>Free Shipping & Returns</span>
            </div>
            <div className="feature">
              <ShieldCheck size={20} strokeWidth={1.5} />
              <span>1 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <ProductReviews productId={product._id} />

    </div>
  );
};

export default ProductDetails;
