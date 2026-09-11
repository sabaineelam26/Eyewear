import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { _id, name, price, discountPrice, mainImage, isFeatured, frameColor } = product;
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { addToast } = useToast();

  const inWishlist = isInWishlist(_id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    await addToCart(product, 1);
    addToast('Added to cart', 'success');
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault(); // prevent triggering the Link if wrapped or clicking through
    if (inWishlist) {
      await removeFromWishlist(_id);
      addToast('Removed from wishlist', 'info');
    } else {
      await addToWishlist(_id);
      addToast('Added to wishlist', 'success');
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
  };

  return (
    <div className="product-card fade-in">
      <div className="product-image-wrapper">
        {isFeatured && <span className="badge featured-badge">Featured</span>}
        {discountPrice && <span className="badge discount-badge">Sale</span>}
        
        <button 
          className="wishlist-btn" 
          aria-label="Add to wishlist"
          onClick={handleWishlistToggle}
        >
          <Heart size={20} strokeWidth={1.5} fill={inWishlist ? "var(--error-color)" : "none"} color={inWishlist ? "var(--error-color)" : "currentColor"} />
        </button>
        
        <Link to={`/products/${_id}`}>
          <img 
            src={mainImage?.url || 'https://via.placeholder.com/400x300?text=No+Image'} 
            alt={name} 
            className="product-image"
            loading="lazy"
            onError={handleImageError}
          />
        </Link>
        
        <div className="quick-add-overlay">
          <button className="quick-add-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <Link to={`/products/${_id}`} className="product-title-link">
          <h3 className="product-title">{name}</h3>
        </Link>
        <p className="product-color">{frameColor || 'Standard'}</p>
        <div className="product-price-container">
          {discountPrice ? (
            <>
              <span className="price-discount">${discountPrice.toFixed(2)}</span>
              <span className="price-original">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="price-regular">${price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
