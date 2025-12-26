'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    size = 'md',
    showValue = false,
    interactive = false,
    onRatingChange,
}) => {
    const [hoverRating, setHoverRating] = React.useState(0);
    const [currentRating, setCurrentRating] = React.useState(rating);

    React.useEffect(() => {
        setCurrentRating(rating);
    }, [rating]);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const handleClick = (value: number) => {
        if (interactive && onRatingChange) {
            setCurrentRating(value);
            onRatingChange(value);
        }
    };

    const handleMouseEnter = (value: number) => {
        if (interactive) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };

    const displayRating = hoverRating || currentRating;

    return (
        <div className="flex items-center gap-1">
            {[...Array(maxRating)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= displayRating;
                const isPartiallyFilled = starValue - 0.5 <= displayRating && starValue > displayRating;

                return (
                    <div
                        key={index}
                        className={`relative ${interactive ? 'cursor-pointer' : ''}`}
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {isPartiallyFilled ? (
                            <div className="relative">
                                <Star className={`${sizeClasses[size]} text-gray-300`} />
                                <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
                                    <Star className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`} />
                                </div>
                            </div>
                        ) : (
                            <Star
                                className={`${sizeClasses[size]} ${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                    } ${interactive ? 'transition-colors hover:text-yellow-400' : ''}`}
                            />
                        )}
                    </div>
                );
            })}
            {showValue && (
                <span className="ml-2 text-sm text-gray-600 font-medium">
                    {currentRating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
