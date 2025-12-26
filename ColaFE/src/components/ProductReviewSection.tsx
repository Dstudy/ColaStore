'use client';

import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { toast } from 'react-toastify';

interface ProductReviewSectionProps {
    productId: number;
    userId?: number;
}

interface ExistingReview {
    id: number;
    rating: number;
    comment: string;
}

const ProductReviewSection: React.FC<ProductReviewSectionProps> = ({
    productId,
    userId,
}) => {
    const [existingReview, setExistingReview] = useState<ExistingReview | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Check if user has already reviewed this product
    useEffect(() => {
        const checkExistingReview = async () => {
            if (!userId) return;

            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:8800/api/products/${productId}/users/${userId}/review`
                );
                const data = await response.json();

                if (data.success && data.data) {
                    setExistingReview(data.data);
                } else {
                    setExistingReview(null);
                }
            } catch (error) {
                console.error('Error checking existing review:', error);
            } finally {
                setLoading(false);
            }
        };

        checkExistingReview();
    }, [productId, userId, refreshKey]);

    const handleSubmitSuccess = () => {
        setShowForm(false);
        setRefreshKey((prev) => prev + 1); // Trigger refresh
        toast.success('Thank you for your review!');
    };

    const handleEditReview = (review: any) => {
        setExistingReview({
            id: review.id,
            rating: review.rating,
            comment: review.comment,
        });
        setShowForm(true);
    };

    return (
        <div className="space-y-6">
            {/* Review Form Section */}
            {userId && (
                <div className="border-b border-gray-200 pb-6">
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full md:w-auto bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            {existingReview ? 'Edit Your Review' : 'Write a Review'}
                        </button>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">
                                {existingReview ? 'Edit Your Review' : 'Write a Review'}
                            </h3>
                            <ReviewForm
                                productId={productId}
                                userId={userId}
                                existingReview={existingReview}
                                onSubmitSuccess={handleSubmitSuccess}
                                onCancel={() => setShowForm(false)}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Reviews List Section */}
            <div>
                <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
                <ReviewList
                    key={refreshKey}
                    productId={productId}
                    currentUserId={userId}
                    onEditReview={handleEditReview}
                />
            </div>
        </div>
    );
};

export default ProductReviewSection;
