import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    // Mock API call
    addToast('Thank you for subscribing to our newsletter!', 'success');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h3>EYEWEAR.</h3>
          <p>Premium eyewear designed for the modern individual. Minimal, elegant, and timeless.</p>
        </div>
        
        <div className="footer-links">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?category=eyeglasses">Eyeglasses</Link></li>
            <li><Link to="/products?category=sunglasses">Sunglasses</Link></li>
            <li><Link to="/products?isFeatured=true">Featured</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/shipping">Shipping & Returns</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/size-guide">Size Guide</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/affiliate">Affiliates</Link></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Newsletter</h4>
          <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="newsletter-input" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} EYEWEAR. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
