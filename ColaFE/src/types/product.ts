export interface ProductImage {
  id?: number;
  product_id?: number;
  pic_url: string;
  display_order?: number;
}

export interface Size {
  id: number;
  name: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  size_id: number;
  stock: number;
  Size: Size;
}

export interface ProductDetails {
  id: number;
  productId: number;
  serving_size: string;
  energy_kcal: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  sugars: number;
  fiber: number;
  ingredient: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  "3DUrl"?: string;
  price: string;
  hasSize: boolean;
  isFeatured: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  ProductImages: ProductImage[];
  ProductVariants?: ProductVariant[];
  ProductDetails?: ProductDetails;
}

export interface ProductsListResponse {
  errCode: number;
  message: string;
  data: {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    products: Product[];
  };
}

export interface ProductDetailResponse {
  errCode: number;
  message: string;
  product: Product;
}


