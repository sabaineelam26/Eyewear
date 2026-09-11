import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating, count, onRate = null, size = 16, color = '#fbbf24' }) => {
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                // Full star
                stars.push(
                    <Star 
                        key={i} 
                        size={size} 
                        fill={color} 
                        color={color} 
                        onClick={() => onRate && onRate(i)}
                        style={{ cursor: onRate ? 'pointer' : 'default' }}
                    />
                );
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                // Half star (Lucide doesn't have a perfect half star filled, so we simulate or use StarHalf if available)
                stars.push(
                    <div key={i} style={{ position: 'relative', width: size, height: size, cursor: onRate ? 'pointer' : 'default' }} onClick={() => onRate && onRate(i)}>
                        <Star size={size} color={color} style={{ position: 'absolute' }} />
                        <div style={{ overflow: 'hidden', width: '50%', position: 'absolute', top: 0, left: 0 }}>
                            <Star size={size} fill={color} color={color} />
                        </div>
                    </div>
                );
            } else {
                // Empty star
                stars.push(
                    <Star 
                        key={i} 
                        size={size} 
                        color={color} 
                        onClick={() => onRate && onRate(i)}
                        style={{ cursor: onRate ? 'pointer' : 'default' }}
                    />
                );
            }
        }
        return stars;
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.1rem' }}>
                {renderStars()}
            </div>
            {count !== undefined && (
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                    ({count} {count === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    );
};

export default StarRating;
