'use client';

import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';

interface ProductRatingProps {
    productId: number;
}

interface RatingData {
    averageRating: string;
    totalReviews: number;
}

const ProductRating: React.FC<ProductRatingProps> = ({ productId }) => {
    const [ratingData, setRatingData] = useState<RatingData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8800/api/products/${productId}/reviews?page=1&limit=1`
                );
                const data = await response.json();

                if (data.success && data.data.statistics) {
                    setRatingData({
                        averageRating: data.data.statistics.averageRating,
                        totalReviews: data.data.statistics.totalReviews
                    });
                }
            } catch (error) {
                console.error('Error fetching rating:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRating();
    }, [productId]);

    if (loading) {
        return (
            <div className="flex items-center gap-1">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
        );
    }

    if (!ratingData || ratingData.totalReviews === 0) {
        return (
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <StarRating rating={0} size="sm" />
                <span>No reviews</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <StarRating rating={parseFloat(ratingData.averageRating)} size="sm" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
                {ratingData.averageRating} ({ratingData.totalReviews})
            </span>
        </div>
    );
};

export default ProductRating;
