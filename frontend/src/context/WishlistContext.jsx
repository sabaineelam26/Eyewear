import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState({ products: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWishlist = async () => {
        if (!user) {
            setWishlist({ products: [] });
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.get('/wishlist');
            setWishlist(data.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching wishlist');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    const addToWishlist = async (productId) => {
        if (!user) return { success: false, message: 'Please login to add to wishlist' };
        
        try {
            const { data } = await api.post('/wishlist', { productId });
            // The post request returns an array of IDs in `products`, but we need populated products for UI.
            // We can just fetch the wishlist again to get the populated products.
            await fetchWishlist();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to add to wishlist' };
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await api.delete(`/wishlist/${productId}`);
            // Optimistically update the UI instead of refetching everything
            setWishlist(prev => ({
                ...prev,
                products: prev.products.filter(p => {
                    const id = typeof p === 'object' ? p._id : p;
                    return id !== productId;
                })
            }));
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to remove from wishlist' };
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.products.some(p => {
            const id = typeof p === 'object' ? p._id : p;
            return id === productId;
        });
    };

    return (
        <WishlistContext.Provider value={{ 
            wishlist, 
            loading, 
            error, 
            addToWishlist, 
            removeFromWishlist,
            isInWishlist,
            fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
