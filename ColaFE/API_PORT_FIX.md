# API Port Fix - Rating System

## Issue
The rating system was failing with "Failed to fetch" errors because the components were trying to connect to the wrong backend port.

## Root Cause
- **Backend Server**: Running on port `8800`
- **Review Components**: Hardcoded to use port `8080`
- **Result**: API calls failed because nothing was listening on port 8080

## Files Fixed

### 1. ReviewList.tsx
- ✅ Fixed `fetchReviews()` API call: `8080` → `8800`
- ✅ Fixed `handleDeleteReview()` API call: `8080` → `8800`

### 2. ReviewForm.tsx
- ✅ Fixed create review API call: `8080` → `8800`
- ✅ Fixed update review API call: `8080` → `8800`

### 3. ProductReviewSection.tsx
- ✅ Fixed check existing review API call: `8080` → `8800`

### 4. Admin Product Page
- ✅ Fixed review statistics fetch: `8080` → `8800`

### 5. reviewService.ts
- ✅ Updated API_BASE_URL: `8080` → `8800`
- ✅ Added environment variable support

## Changes Made

### Before:
```tsx
const response = await fetch(
    `http://localhost:8080/api/products/${productId}/reviews`
);
```

### After:
```tsx
const response = await fetch(
    `http://localhost:8800/api/products/${productId}/reviews`
);
```

## Testing

After this fix, the rating system should work correctly:

1. ✅ View reviews on product pages
2. ✅ See rating statistics
3. ✅ Submit new reviews
4. ✅ Edit existing reviews
5. ✅ Delete reviews
6. ✅ Admin view shows reviews

## Environment Variable Support

The `reviewService.ts` now supports environment variables:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8800';
```

To use a different URL in production, add to `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Status
✅ **FIXED** - All API calls now point to the correct port (8800)

The rating system should now work without any fetch errors!
