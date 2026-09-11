import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          api.get('/products?isFeatured=true&limit=4'),
          api.get('/products?sort=-createdAt&limit=4')
        ]);
        setFeaturedProducts(featuredRes.data.data);
        setNewArrivals(newRes.data.data);
      } catch (error) {
        console.error('Error fetching home data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section fade-in">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>See the World Clearly.<br/>Look Good Doing It.</h1>
            <p>Discover our premium collection of minimal, elegant eyewear designed to elevate your everyday look.</p>
            <div className="hero-btns">
              <Link to="/products?category=Eyeglasses" className="btn-primary">Shop Eyeglasses</Link>
              <Link to="/products?category=Sunglasses" className="btn-secondary">Shop Sunglasses</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Frame Shapes */}
      <section className="shapes-section container">
        <div className="section-header">
          <h2>Shop by Frame Shape</h2>
        </div>
        <div className="shapes-grid">
          {['Round', 'Square', 'Rectangle', 'Cat-Eye'].map(shape => (
             <Link to={`/products?shape=${shape}`} key={shape} className="shape-card">
               <div className="shape-icon"></div>
               <span>{shape}</span>
             </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container">
        <div className="section-header">
          <h2>Featured Collection</h2>
          <Link to="/products?isFeatured=true" className="view-all-link">View All</Link>
        </div>
        
        {loading ? <div className="loading-spinner">Loading...</div> : (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="why-us-section">
        <div className="container why-us-container">
          <div className="why-us-item">
            <h3>Premium Materials</h3>
            <p>Crafted from high-quality acetate and lightweight titanium for ultimate comfort and durability.</p>
          </div>
          <div className="why-us-item">
            <h3>Blue Light Protection</h3>
            <p>All our lenses come with optional advanced blue light filtering technology.</p>
          </div>
          <div className="why-us-item">
            <h3>Free Shipping & Returns</h3>
            <p>Enjoy free shipping on all orders and a hassle-free 30-day return policy.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
