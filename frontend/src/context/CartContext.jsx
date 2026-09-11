import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState({ items: [], totalPrice: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        if (!user) {
            setCart({ items: [], totalPrice: 0 });
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.get('/cart');
            setCart(data.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (productId, quantity = 1) => {
        if (!user) return { success: false, message: 'Please login to add to cart' };
        
        try {
            const { data } = await api.post('/cart', { productId, quantity });
            setCart(data.data);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const { data } = await api.put(`/cart/${itemId}`, { quantity });
            setCart(data.data);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update quantity' };
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const { data } = await api.delete(`/cart/${itemId}`);
            setCart(data.data);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to remove item' };
        }
    };

    const clearCart = async () => {
        try {
            const { data } = await api.delete('/cart');
            setCart(data.data);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to clear cart' };
        }
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            loading, 
            error, 
            addToCart, 
            updateQuantity, 
            removeFromCart, 
            clearCart,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
