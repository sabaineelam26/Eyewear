import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, Layers, ShoppingCart, Users, Star, Ticket, LogOut } from 'lucide-react';
import { AdminAuthContext } from '../../context/AdminAuthContext';

const AdminSidebar = () => {
    const { logoutAdmin } = useContext(AdminAuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    return (
        <aside className="admin-sidebar">
            <div className="admin-brand">
                EYEWEAR. <span className="admin-badge">ADMIN</span>
            </div>

            <nav className="admin-nav">
                <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                    <LayoutDashboard size={18} /> Dashboard
                </NavLink>
                <NavLink to="/admin/products" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                    <Package size={18} /> Products
                </NavLink>
                <NavLink to="/admin/categories" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                    <Layers size={18} /> Categories
                </NavLink>
                <NavLink to="/admin/orders" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                    <ShoppingCart size={18} /> Orders
                </NavLink>
                <NavLink to="/admin/inventory" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                    <Tag size={18} /> Inventory
                </NavLink>
                <NavLink to="/admin/customers" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                    <Users size={18} /> Customers
                </NavLink>
                
                {/* Coming Soon Links */}
                <div className="admin-nav-link disabled" title="Coming Soon">
                    <Star size={18} /> Reviews
                </div>
                <div className="admin-nav-link disabled" title="Coming Soon">
                    <Ticket size={18} /> Coupons
                </div>
            </nav>

            <div className="admin-logout">
                <button onClick={handleLogout} className="admin-nav-link logout-btn">
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
