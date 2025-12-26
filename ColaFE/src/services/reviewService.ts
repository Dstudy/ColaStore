// Review API Service
// Centralized API calls for the review system

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8800';

export const reviewAPI = {
    /**
     * Create a new review
     */
    createReview: async (data: {
        productId: number;
        userId: number;
        rating: number;
        comment?: string;
    }) => {
        const response = await fetch(`${API_BASE_URL}/api/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    /**
     * Get all reviews for a product
     */
    getProductReviews: async (
        productId: number,
        options?: {
            page?: number;
            limit?: number;
            sortBy?: string;
            order?: 'ASC' | 'DESC';
        }
    ) => {
        const params = new URLSearchParams({
            page: String(options?.page || 1),
            limit: String(options?.limit || 10),
            sortBy: options?.sortBy || 'createdAt',
            order: options?.order || 'DESC',
        });

        const response = await fetch(
            `${API_BASE_URL}/api/products/${productId}/reviews?${params}`
        );
        return response.json();
    },

    /**
     * Get a user's review for a specific product
     */
    getUserProductReview: async (productId: number, userId: number) => {
        const response = await fetch(
            `${API_BASE_URL}/api/products/${productId}/users/${userId}/review`
        );
        return response.json();
    },

    /**
     * Get all reviews by a user
     */
    getUserReviews: async (
        userId: number,
        options?: {
            page?: number;
            limit?: number;
        }
    ) => {
        const params = new URLSearchParams({
            page: String(options?.page || 1),
            limit: String(options?.limit || 10),
        });

        const response = await fetch(
            `${API_BASE_URL}/api/users/${userId}/reviews?${params}`
        );
        return response.json();
    },

    /**
     * Update an existing review
     */
    updateReview: async (
        reviewId: number,
        data: {
            userId: number;
            rating?: number;
            comment?: string;
        }
    ) => {
        const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    /**
     * Delete a review
     */
    deleteReview: async (reviewId: number, userId: number) => {
        const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        return response.json();
    },
};

export default reviewAPI;
