'use client';

import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { ShieldCheck, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface Review {
    id: number;
    rating: number;
    comment: string;
    isVerifiedPurchase: boolean;
    createdAt: string;
    user: {
        id: number;
        fullname: string;
    };
}

interface ReviewListProps {
    productId: number;
    currentUserId?: number;
    onEditReview?: (review: Review) => void;
}

interface ReviewStatistics {
    averageRating: string;
    totalReviews: number;
    ratingDistribution: {
        [key: number]: number;
    };
}

const ReviewList: React.FC<ReviewListProps> = ({
    productId,
    currentUserId,
    onEditReview,
}) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8800/api/products/${productId}/reviews?page=${page}&limit=${limit}`
            );
            const data = await response.json();

            if (data.success) {
                setReviews(data.data.reviews);
                setStatistics(data.data.statistics);
                setTotalPages(data.data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId, page]);

    const handleDeleteReview = async (reviewId: number) => {
        if (!confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8800/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: currentUserId }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Review deleted successfully');
                fetchReviews();
            } else {
                toast.error(data.message || 'Failed to delete review');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('An error occurred while deleting the review');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getRatingPercentage = (rating: number) => {
        if (!statistics || statistics.totalReviews === 0) return 0;
        return ((statistics.ratingDistribution[rating] || 0) / statistics.totalReviews) * 100;
    };

    if (loading && page === 1) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            {statistics && statistics.totalReviews > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Average Rating */}
                        <div className="text-center md:text-left">
                            <div className="text-5xl font-bold text-gray-900 mb-2">
                                {statistics.averageRating}
                            </div>
                            <StarRating rating={parseFloat(statistics.averageRating)} size="lg" />
                            <p className="text-sm text-gray-600 mt-2">
                                Based on {statistics.totalReviews} review{statistics.totalReviews !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center gap-2">
                                    <span className="text-sm font-medium w-8">{rating} ★</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full transition-all"
                                            style={{ width: `${getRatingPercentage(rating)}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 w-12 text-right">
                                        {statistics.ratingDistribution[rating] || 0}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900">
                                            {review.user.fullname}
                                        </span>
                                        {review.isVerifiedPurchase && (
                                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                <ShieldCheck className="w-3 h-3" />
                                                Verified Purchase
                                            </span>
                                        )}
                                    </div>
                                    <StarRating rating={review.rating} size="sm" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        {formatDate(review.createdAt)}
                                    </span>
                                    {currentUserId === review.user.id && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => onEditReview && onEditReview(review)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit review"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReview(review.id)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                title="Delete review"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-gray-700 mt-2 whitespace-pre-wrap">{review.comment}</p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;
