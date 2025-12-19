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

export interface Product {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  hasSize: boolean;
  isFeatured: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  ProductImages: ProductImage[];
  ProductVariants?: ProductVariant[];
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


