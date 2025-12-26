import models from "../models/index.js";
import { sequelize } from "../models/index.js";
const { Review, Product, User, Order, OrderItem } = models;

// Create a new review
const createReview = async (req, res) => {
    try {
        const { productId, userId, rating, comment } = req.body;

        // Validate required fields
        if (!productId || !userId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Product ID, User ID, and rating are required"
            });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user has already reviewed this product
        const existingReview = await Review.findOne({
            where: { product_id: productId, user_id: userId }
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product. Please update your existing review instead."
            });
        }

        // Check if this is a verified purchase
        const hasPurchased = await OrderItem.findOne({
            include: [{
                model: Order,
                where: {
                    user_id: userId,
                    status: 'completed'
                }
            }],
            where: { product_id: productId }
        });

        // Create the review
        const review = await Review.create({
            product_id: productId,
            user_id: userId,
            rating,
            comment: comment || null,
            isVerifiedPurchase: !!hasPurchased
        });

        // Fetch the created review with user details
        const createdReview = await Review.findByPk(review.id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "fullname", "email"]
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: createdReview
        });
    } catch (error) {
        console.error("Error creating review:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create review",
            error: error.message
        });
    }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = req.query;

        const offset = (page - 1) * limit;

        const { count, rows: reviews } = await Review.findAndCountAll({
            where: { product_id: productId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "fullname", "email"]
                }
            ],
            order: [[sortBy, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Calculate average rating
        const avgRating = await Review.findOne({
            where: { product_id: productId },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
            ],
            raw: true
        });

        // Get rating distribution
        const ratingDistribution = await Review.findAll({
            where: { product_id: productId },
            attributes: [
                'rating',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['rating'],
            raw: true
        });

        return res.status(200).json({
            success: true,
            data: {
                reviews,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                },
                statistics: {
                    averageRating: parseFloat(avgRating?.averageRating || 0).toFixed(1),
                    totalReviews: parseInt(avgRating?.totalReviews || 0),
                    ratingDistribution: ratingDistribution.reduce((acc, curr) => {
                        acc[curr.rating] = parseInt(curr.count);
                        return acc;
                    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
                }
            }
        });
    } catch (error) {
        console.error("Error fetching product reviews:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
            error: error.message
        });
    }
};

// Get user's review for a specific product
const getUserProductReview = async (req, res) => {
    try {
        const { productId, userId } = req.params;

        const review = await Review.findOne({
            where: {
                product_id: productId,
                user_id: userId
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "fullname", "email"]
                }
            ]
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error("Error fetching user review:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch review",
            error: error.message
        });
    }
};

// Update a review
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment, userId } = req.body;

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Verify that the user owns this review
        if (review.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this review"
            });
        }

        // Validate rating if provided
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Update the review
        if (rating !== undefined) review.rating = rating;
        if (comment !== undefined) review.comment = comment;

        await review.save();

        // Fetch updated review with user details
        const updatedReview = await Review.findByPk(reviewId, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "fullname", "email"]
                }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: updatedReview
        });
    } catch (error) {
        console.error("Error updating review:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update review",
            error: error.message
        });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { userId } = req.body;

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Verify that the user owns this review
        if (review.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this review"
            });
        }

        await review.destroy();

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete review",
            error: error.message
        });
    }
};

// Get all reviews by a user
const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        const { count, rows: reviews } = await Review.findAndCountAll({
            where: { user_id: userId },
            include: [
                {
                    model: Product,
                    as: "product",
                    attributes: ["id", "name", "subtitle", "price"]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return res.status(200).json({
            success: true,
            data: {
                reviews,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user reviews",
            error: error.message
        });
    }
};

export default {
    createReview,
    getProductReviews,
    getUserProductReview,
    updateReview,
    deleteReview,
    getUserReviews
};
