# Frontend Rating System - Usage Guide

## Components Created

### 1. **StarRating.tsx**
A reusable star rating component that can be used in both display and interactive modes.

**Props:**
- `rating` (number): The rating value (0-5)
- `maxRating` (number, optional): Maximum rating (default: 5)
- `size` ('sm' | 'md' | 'lg', optional): Size of stars (default: 'md')
- `showValue` (boolean, optional): Show numeric value next to stars
- `interactive` (boolean, optional): Enable click interaction
- `onRatingChange` (function, optional): Callback when rating changes

**Usage:**
```tsx
// Display mode
<StarRating rating={4.5} size="md" showValue={true} />

// Interactive mode
<StarRating 
  rating={rating} 
  interactive={true} 
  onRatingChange={(value) => setRating(value)}
  size="lg"
/>
```

### 2. **ReviewForm.tsx**
Form component for creating and editing reviews.

**Props:**
- `productId` (number): ID of the product being reviewed
- `userId` (number): ID of the user submitting the review
- `existingReview` (object, optional): Existing review data for editing
- `onSubmitSuccess` (function, optional): Callback after successful submission
- `onCancel` (function, optional): Callback for cancel action

**Usage:**
```tsx
<ReviewForm
  productId={123}
  userId={456}
  existingReview={existingReview}
  onSubmitSuccess={() => console.log('Review submitted!')}
  onCancel={() => setShowForm(false)}
/>
```

### 3. **ReviewList.tsx**
Displays a list of reviews with statistics and pagination.

**Props:**
- `productId` (number): ID of the product
- `currentUserId` (number, optional): Current user's ID for edit/delete permissions
- `onEditReview` (function, optional): Callback when user clicks edit

**Features:**
- Rating statistics and distribution chart
- Pagination support
- Edit/Delete buttons for user's own reviews
- Verified purchase badge
- Responsive design

**Usage:**
```tsx
<ReviewList
  productId={123}
  currentUserId={456}
  onEditReview={(review) => handleEdit(review)}
/>
```

### 4. **ProductReviewSection.tsx**
Complete review section combining form and list.

**Props:**
- `productId` (number): ID of the product
- `userId` (number, optional): Current user's ID

**Features:**
- Automatically checks if user has already reviewed
- Toggles between form and list views
- Handles refresh after submission
- Shows "Write a Review" or "Edit Your Review" button

**Usage:**
```tsx
<ProductReviewSection
  productId={123}
  userId={456}
/>
```

## Integration Example

### In a Product Detail Page:

```tsx
'use client';

import React from 'react';
import ProductReviewSection from '@/components/ProductReviewSection';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id);
  const userId = 123; // Get from your auth context/session

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Details */}
      <div className="mb-12">
        <h1>Product Name</h1>
        <p>Product description...</p>
      </div>

      {/* Reviews Section */}
      <ProductReviewSection
        productId={productId}
        userId={userId}
      />
    </div>
  );
}
```

### Quick Integration in Existing Product Page:

1. Import the component:
```tsx
import ProductReviewSection from '@/components/ProductReviewSection';
```

2. Add it to your product page:
```tsx
<ProductReviewSection productId={product.id} userId={currentUser?.id} />
```

## Styling

All components use Tailwind CSS classes and follow the Coca-Cola brand colors:
- Primary: Red (#DC2626 - red-600)
- Accent: Yellow (#FBBF24 - yellow-400) for stars
- Text: Gray scale for content

## Features Included

✅ **Create Review**: Users can submit ratings and comments
✅ **Edit Review**: Users can update their existing reviews
✅ **Delete Review**: Users can remove their reviews
✅ **View Reviews**: Display all product reviews with pagination
✅ **Rating Statistics**: Show average rating and distribution
✅ **Verified Purchase Badge**: Automatically shown for verified purchases
✅ **Responsive Design**: Works on mobile, tablet, and desktop
✅ **Loading States**: Spinner animations during data fetch
✅ **Error Handling**: Toast notifications for errors
✅ **Validation**: Rating required, comment optional (max 1000 chars)
✅ **Authorization**: Users can only edit/delete their own reviews

## API Endpoints Used

The components connect to these backend endpoints:
- `POST /api/reviews` - Create review
- `GET /api/products/:productId/reviews` - Get product reviews
- `GET /api/products/:productId/users/:userId/review` - Get user's review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

## Notes

- Make sure the backend server is running on `http://localhost:8080`
- Update the API base URL if your backend runs on a different port
- The `userId` should come from your authentication system
- Toast notifications require `react-toastify` to be set up in your app
