import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit2 } from 'lucide-react';

const ProductReviews = ({ productId }) => {
    const { user, token } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Form state
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    
    // Edit state
    const [editingReview, setEditingReview] = useState(null);

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/products/${productId}/reviews`);
            setReviews(data.data);
        } catch (err) {
            setError('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchReviews();
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        
        if (rating === 0) {
            return setFormError('Please select a star rating');
        }

        setSubmitting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            if (editingReview) {
                await axios.put(`http://localhost:5000/api/reviews/${editingReview._id}`, { rating, comment }, config);
                setEditingReview(null);
            } else {
                await axios.post(`http://localhost:5000/api/products/${productId}/reviews`, { rating, comment }, config);
            }
            
            setRating(0);
            setComment('');
            fetchReviews(); // refresh
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, config);
            fetchReviews();
        } catch (err) {
            alert('Failed to delete review');
        }
    };

    const startEdit = (review) => {
        setEditingReview(review);
        setRating(review.rating);
        setComment(review.comment);
        // Scroll to form smoothly
        window.scrollTo({ top: document.getElementById('review-form').offsetTop - 100, behavior: 'smooth' });
    };

    const userHasReviewed = user && reviews.some(r => r.user?._id === user._id);
    const showForm = user && (!userHasReviewed || editingReview);

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Customer Reviews</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {/* Review List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {reviews.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review this product!</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review._id} style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{review.user?.name || 'Customer'}</h4>
                                        <StarRating rating={review.rating} size={14} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                        {user && user._id === review.user?._id && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => startEdit(review)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Edit2 size={14}/></button>
                                                <button onClick={() => handleDelete(review._id)} style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer' }}><Trash2 size={14}/></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p style={{ lineHeight: 1.6, color: 'var(--text-primary)' }}>{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Review Form */}
                {showForm && (
                    <div id="review-form" style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                            {editingReview ? 'Edit Your Review' : 'Write a Review'}
                        </h3>
                        
                        {formError && <div className="error-message" style={{ marginBottom: '1rem' }}>{formError}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Rating</label>
                                <div style={{ padding: '0.5rem 0' }}>
                                    <StarRating rating={rating} onRate={setRating} size={24} />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Your Review</label>
                                <textarea 
                                    className="form-input" 
                                    rows="4" 
                                    required 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="What did you like or dislike? How did the product fit?"
                                ></textarea>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? 'Submitting...' : (editingReview ? 'Update Review' : 'Submit Review')}
                                </button>
                                {editingReview && (
                                    <button type="button" className="btn-secondary" onClick={() => { setEditingReview(null); setRating(0); setComment(''); }}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
                
                {!user && (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
                        <p>Please <a href="/login" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>log in</a> to write a review.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
