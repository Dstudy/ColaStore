# Rating & Review API Documentation

## Overview
The rating system allows users to rate and review products. Reviews include a 1-5 star rating, optional comment, and verification status based on purchase history.

## Database Schema
- **Table**: `reviews`
- **Fields**:
  - `id`: Primary key
  - `product_id`: Foreign key to products
  - `user_id`: Foreign key to users
  - `rating`: Integer (1-5)
  - `comment`: Text (optional)
  - `isVerifiedPurchase`: Boolean (auto-detected)
  - `createdAt`, `updatedAt`: Timestamps

## API Endpoints

### 1. Create Review
**POST** `/api/reviews`

**Request Body:**
```json
{
  "productId": 1,
  "userId": 123,
  "rating": 5,
  "comment": "Great product!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": 1,
    "product_id": 1,
    "user_id": 123,
    "rating": 5,
    "comment": "Great product!",
    "isVerifiedPurchase": true,
    "user": {
      "id": 123,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    }
  }
}
```

### 2. Get Product Reviews
**GET** `/api/products/:productId/reviews?page=1&limit=10&sortBy=createdAt&order=DESC`

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    },
    "statistics": {
      "averageRating": "4.5",
      "totalReviews": 50,
      "ratingDistribution": {
        "1": 2,
        "2": 3,
        "3": 5,
        "4": 15,
        "5": 25
      }
    }
  }
}
```

### 3. Get User's Review for a Product
**GET** `/api/products/:productId/users/:userId/review`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "rating": 5,
    "comment": "Great product!",
    "isVerifiedPurchase": true,
    "createdAt": "2025-12-26T08:30:00.000Z"
  }
}
```

### 4. Get All User Reviews
**GET** `/api/users/:userId/reviews?page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [...],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### 5. Update Review
**PUT** `/api/reviews/:reviewId`

**Request Body:**
```json
{
  "userId": 123,
  "rating": 4,
  "comment": "Updated comment"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {...}
}
```

### 6. Delete Review
**DELETE** `/api/reviews/:reviewId`

**Request Body:**
```json
{
  "userId": 123
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

## Features

### ✅ Implemented
- Create, read, update, delete reviews
- 1-5 star rating validation
- Prevent duplicate reviews (one review per user per product)
- Automatic verified purchase detection
- Rating statistics and distribution
- Pagination support
- User authorization (users can only edit/delete their own reviews)
- Indexed queries for performance

### 🔒 Security
- User ownership verification for update/delete operations
- Input validation for rating range (1-5)
- Foreign key constraints with CASCADE delete

## Usage Example

```javascript
// Create a review
const response = await fetch('http://localhost:8080/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 1,
    userId: 123,
    rating: 5,
    comment: 'Excellent product!'
  })
});

// Get product reviews with statistics
const reviews = await fetch('http://localhost:8080/api/products/1/reviews?page=1&limit=10');
const data = await reviews.json();
console.log(data.data.statistics.averageRating); // "4.5"
```
