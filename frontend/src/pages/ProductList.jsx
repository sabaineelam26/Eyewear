import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { useToast } from '../context/ToastContext';
import './ProductList.css';

const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState({});
  const [total, setTotal] = useState(0);

  // Parse URL query
  const queryParams = new URLSearchParams(location.search);
  const initialFilters = {
    search: queryParams.get('search') || '',
    category: queryParams.get('category') || '',
    shape: queryParams.get('shape') || '',
    lensType: queryParams.get('lensType') || '',
    isFeatured: queryParams.get('isFeatured') || '',
    minPrice: queryParams.get('minPrice') || '',
    maxPrice: queryParams.get('maxPrice') || '',
    sort: queryParams.get('sort') || 'newest',
    page: parseInt(queryParams.get('page')) || 1
  };

  const [filters, setFilters] = useState(initialFilters);

  // Sync state with URL when URL changes (e.g., from Navbar links)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlFilters = {
      search: queryParams.get('search') || '',
      category: queryParams.get('category') || '',
      shape: queryParams.get('shape') || '',
      lensType: queryParams.get('lensType') || '',
      isFeatured: queryParams.get('isFeatured') || '',
      minPrice: queryParams.get('minPrice') || '',
      maxPrice: queryParams.get('maxPrice') || '',
      sort: queryParams.get('sort') || 'newest',
      page: parseInt(queryParams.get('page')) || 1
    };

    setFilters(prev => {
      let isDifferent = false;
      for (const key in urlFilters) {
        if (String(urlFilters[key]) !== String(prev[key])) {
          isDifferent = true;
          break;
        }
      }
      return isDifferent ? urlFilters : prev;
    });
  }, [location.search]);

  // Options
  const shapeOptions = ['Round', 'Square', 'Rectangle', 'Oval', 'Cat-Eye', 'Aviator'];
  const lensOptions = ['Clear', 'Blue Light', 'Prescription', 'Sunglasses'];
  
  const sortOptions = [
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'featured', label: 'Featured' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data.data))
      .catch(console.error);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
          if (val) params.append(key, val);
        });
        
        navigate(`/products?${params.toString()}`, { replace: true });

        console.log('Fetching products with URL:', `/products?${params.toString()}`);
        const { data } = await api.get(`/products?${params.toString()}`);
        console.log('Received products:', data);
        setProducts(data.data);
        setPagination(data.pagination || {});
        setTotal(data.total || 0);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, navigate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', shape: '', lensType: '', isFeatured: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 });
  };

  const FilterSidebar = () => (
    <div className="filter-sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Filters</h3>
        <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.9rem' }}>Clear All</button>
      </div>

      <div className="filter-group">
        <h4>Search</h4>
        <input type="text" name="search" placeholder="Search by name or brand..." value={filters.search} onChange={handleFilterChange} className="form-input" style={{marginBottom: 0}} />
      </div>

      <div className="filter-group">
        <h4>Category</h4>
        <select name="category" value={filters.category} onChange={handleFilterChange} className="form-input">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <h4>Price Range ($)</h4>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleFilterChange} className="form-input" style={{ margin: 0 }} />
          <span>-</span>
          <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} className="form-input" style={{ margin: 0 }} />
        </div>
      </div>

      <div className="filter-group">
        <h4>Frame Shape</h4>
        <select name="shape" value={filters.shape} onChange={handleFilterChange} className="form-input">
          <option value="">All Shapes</option>
          {shapeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <h4>Lens Type</h4>
        <select name="lensType" value={filters.lensType} onChange={handleFilterChange} className="form-input">
          <option value="">All Lenses</option>
          {lensOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div className="products-page container fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {filters.search ? `Results for "${filters.search}"` : 'All Eyewear'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Showing {products.length} of {total} products</p>
        </div>
        
        {/* Desktop Sort & Mobile Filter Toggle */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="mobile-filter-btn" onClick={() => setShowMobileFilter(true)}>
            <Filter size={18} /> Filters
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }} className="hide-mobile">Sort by:</span>
            <select name="sort" value={filters.sort} onChange={handleFilterChange} className="form-input" style={{ margin: 0, minWidth: '180px' }}>
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }} className="catalog-grid">
        {/* Desktop Sidebar */}
        <div className="desktop-sidebar">
          {FilterSidebar()}
        </div>

        {/* Mobile Drawer */}
        {showMobileFilter && (
          <div className="mobile-drawer-overlay">
            <div className="mobile-drawer slide-in-left">
              <div className="drawer-header">
                <h3>Filters</h3>
                <button onClick={() => setShowMobileFilter(false)} className="close-btn"><X size={24} /></button>
              </div>
              <div className="drawer-content">
                {FilterSidebar()}
              </div>
              <div className="drawer-footer">
                <button onClick={() => setShowMobileFilter(false)} className="btn-primary" style={{ width: '100%' }}>View {total} Products</button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div>
          {error && <div className="error-message" style={{ marginBottom: '2rem' }}>{error}</div>}
          
          {loading ? (
            <div className="product-grid">
              {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No products found</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {(pagination.prev || pagination.next) && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem', alignItems: 'center' }}>
                  <button 
                    className="btn-secondary" 
                    disabled={!pagination.prev}
                    onClick={() => setFilters(prev => ({ ...prev, page: pagination.prev.page }))}
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span style={{ fontWeight: 500 }}>Page {filters.page}</span>
                  <button 
                    className="btn-primary" 
                    disabled={!pagination.next}
                    onClick={() => setFilters(prev => ({ ...prev, page: pagination.next.page }))}
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
