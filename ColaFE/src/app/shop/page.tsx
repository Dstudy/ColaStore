"use client";
import ImageWithFallback from "@/components/ImageWithFallback";
import useSWR from "swr";
import Link from "next/link";
import {
  ProductsListResponse,
} from "@/types/product";

const fetcher = async (url: string): Promise<ProductsListResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
};

export default function ShopPage() {
  const { data, error, isLoading } = useSWR<ProductsListResponse>(
    "http://localhost:8800/api/products",
    fetcher
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg mb-2">
            Error loading products
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.errCode !== 0 || !data.data?.products) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No products available
          </p>
        </div>
      </div>
    );
  }

  const products = data.data.products;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Shop
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {data.data.totalProducts} products available
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 block"
            >
              <div className="aspect-square w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <ImageWithFallback
                  src={product.ProductImages?.[0]?.pic_url}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {product.subtitle}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                  {product.hasSize && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      Sizes Available
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
