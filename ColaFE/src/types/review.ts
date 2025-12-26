// Review and Rating Types

export interface Review {
    id: number;
    product_id: number;
    user_id: number;
    rating: number;
    comment: string | null;
    isVerifiedPurchase: boolean;
    createdAt: string;
    updatedAt: string;
    user?: User;
    product?: Product;
}

export interface User {
    id: number;
    fullname: string;
    email: string;
}

export interface Product {
    id: number;
    name: string;
    subtitle?: string;
    price: number;
}

export interface ReviewStatistics {
    averageRating: string;
    totalReviews: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

export interface ReviewListResponse {
    success: boolean;
    data: {
        reviews: Review[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        statistics: ReviewStatistics;
    };
}

export interface ReviewResponse {
    success: boolean;
    message?: string;
    data?: Review;
    error?: string;
}

export interface CreateReviewRequest {
    productId: number;
    userId: number;
    rating: number;
    comment?: string;
}

export interface UpdateReviewRequest {
    userId: number;
    rating?: number;
    comment?: string;
}

export interface DeleteReviewRequest {
    userId: number;
}
