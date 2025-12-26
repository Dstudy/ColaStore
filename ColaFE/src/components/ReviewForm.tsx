'use client';

import React, { useState } from 'react';
import StarRating from './StarRating';
import { toast } from 'react-toastify';

interface ReviewFormProps {
    productId: number;
    userId: number;
    existingReview?: {
        id: number;
        rating: number;
        comment: string;
    } | null;
    onSubmitSuccess?: () => void;
    onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
    productId,
    userId,
    existingReview,
    onSubmitSuccess,
    onCancel,
}) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);

        try {
            const url = existingReview
                ? `http://localhost:8800/api/reviews/${existingReview.id}`
                : 'http://localhost:8800/api/reviews';

            const method = existingReview ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    userId,
                    rating,
                    comment: comment.trim() || null,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message || 'Review submitted successfully!');
                if (onSubmitSuccess) {
                    onSubmitSuccess();
                }
                // Reset form if creating new review
                if (!existingReview) {
                    setRating(0);
                    setComment('');
                }
            } else {
                toast.error(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('An error occurred while submitting your review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating *
                </label>
                <StarRating
                    rating={rating}
                    interactive={true}
                    onRatingChange={setRating}
                    size="lg"
                />
            </div>

            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review (Optional)
                </label>
                <textarea
                    id="comment"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Share your thoughts about this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {comment.length}/1000 characters
                </p>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default ReviewForm;
