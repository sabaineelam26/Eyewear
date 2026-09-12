import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      closeMobileMenu();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          EYEWEAR.
        </Link>

        {/* Navigation Links */}
        <nav className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/products?category=Eyeglasses" className="nav-link" onClick={closeMobileMenu}>Eyeglasses</Link>
          <Link to="/products?category=Sunglasses" className="nav-link" onClick={closeMobileMenu}>Sunglasses</Link>
          <Link to="/products?sort=newest" className="nav-link" onClick={closeMobileMenu}>New Arrivals</Link>
          <Link to="/products?isFeatured=true" className="nav-link" onClick={closeMobileMenu}>Featured</Link>
        </nav>

        {/* Icons */}
        <div className="navbar-icons">
          <div className={`search-container ${isSearchOpen ? 'open' : ''}`}>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </form>
            <button 
              className="btn-icon search-toggle" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle Search"
            >
              {isSearchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
            </button>
          </div>
          
          {user ? (
            <div className="user-menu-container desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Link to="/orders" className="btn-icon" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }} title="My Orders" onClick={closeMobileMenu}>
                 <User size={20} strokeWidth={1.5} />
                 <span className="user-name-text">{user.name.split(' ')[0]}</span>
               </Link>
               <button onClick={handleLogout} className="btn-icon" title="Logout" style={{ marginLeft: '0.5rem' }}>
                 <LogOut size={20} strokeWidth={1.5} />
               </button>
            </div>
          ) : (
            <Link to="/login" className="btn-icon desktop-only" title="Login" onClick={closeMobileMenu}>
              <User size={20} strokeWidth={1.5} />
            </Link>
          )}

          <Link to="/wishlist" className="btn-icon cart-icon" onClick={closeMobileMenu}>
            <Heart size={20} strokeWidth={1.5} />
            {wishlist?.products?.length > 0 && <span className="cart-badge">{wishlist.products.length}</span>}
          </Link>
          
          <Link to="/cart" className="btn-icon cart-icon" onClick={closeMobileMenu}>
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="cart-badge">{cart?.items?.length || 0}</span>
          </Link>
          
          {/* Mobile Menu Toggle Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle Menu">
            {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
      
      {/* Mobile User Menu (Shown when menu is open on mobile) */}
      {isMobileMenuOpen && (
        <div className="mobile-user-menu">
          {user ? (
            <>
              <Link to="/orders" className="mobile-user-link" onClick={closeMobileMenu}>
                <User size={20} strokeWidth={1.5} />
                <span>My Orders ({user.name.split(' ')[0]})</span>
              </Link>
              <button onClick={handleLogout} className="mobile-user-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}>
                <LogOut size={20} strokeWidth={1.5} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-user-link" onClick={closeMobileMenu}>
              <User size={20} strokeWidth={1.5} />
              <span>Login / Register</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
