import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import ProtectedRoute from './components/ProtectedRoute';
import StaticPage from './pages/StaticPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminInventory from './pages/admin/AdminInventory';
import AdminCustomers from './pages/admin/AdminCustomers';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
        <Router>
          <Routes>
            {/* Admin Routes - Completely separate from MainLayout */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetails />} />
                <Route path="customers" element={<AdminCustomers />} />
              </Route>
            </Route>

            {/* Customer Routes - Wrapped in MainLayout */}
            <Route path="/*" element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/contact" element={<StaticPage title="Contact Us" />} />
                  <Route path="/shipping" element={<StaticPage title="Shipping & Returns" />} />
                  <Route path="/faq" element={<StaticPage title="Frequently Asked Questions" />} />
                  <Route path="/size-guide" element={<StaticPage title="Size Guide" />} />
                  
                  {/* Protected Customer Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders/confirmation/:id" element={<OrderConfirmation />} />
                    <Route path="/orders" element={<MyOrders />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/profile" element={<div className="container" style={{padding: '5rem 0', textAlign: 'center'}}><h2>Profile (Coming Soon)</h2></div>} />
                  </Route>
                </Routes>
              </MainLayout>
            } />
          </Routes>
        </Router>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
