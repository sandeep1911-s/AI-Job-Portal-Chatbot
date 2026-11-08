import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, setRating, disabled = false }) {
    const [hover, setHover] = useState(0);

    return (
        <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !disabled && setRating(star)}
                    onMouseEnter={() => !disabled && setHover(star)}
                    onMouseLeave={() => !disabled && setHover(0)}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: disabled ? 'default' : 'pointer',
                        transition: 'transform 0.2s',
                        transform: (hover === star || (!hover && rating === star)) ? 'scale(1.1)' : 'scale(1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Star
                        size={32}
                        fill={(hover || rating) >= star ? '#fbbf24' : 'none'}
                        color={(hover || rating) >= star ? '#fbbf24' : 'var(--border)'}
                        style={{ transition: 'all 0.2s ease' }}
                    />
                </button>
            ))}
        </div>
    );
}
