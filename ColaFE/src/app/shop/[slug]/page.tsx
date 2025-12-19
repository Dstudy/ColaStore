"use client";
import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  ProductDetailResponse,
} from "@/types/product";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

interface PageParams {
  slug: string;
}

interface PageProps {
  params: PageParams | Promise<PageParams>;
}

const fetcher = async (url: string): Promise<ProductDetailResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
};

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // In newer Next.js versions, `params` may be passed as a Promise in client components
  const resolvedParams =
    params instanceof Promise ? use(params) : (params as PageParams);

  const {
    data,
    error,
    isLoading,
  } = useSWR<ProductDetailResponse>(
    `http://localhost:8800/api/products/${resolvedParams.slug}`,
    fetcher
  );

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(userStr);
        if (user?.id) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Set default size if product has sizes
    if (data?.product?.hasSize && data.product.ProductVariants && data.product.ProductVariants.length > 0) {
      setSelectedSize(data.product.ProductVariants[0].id);
    }
  }, [data]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !data || data.errCode !== 0 || !data.product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Error loading product</p>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : "Product not found"}
          </p>
        </div>
      </main>
    );
  }

  const product = data.product;
  const mainImage = product.ProductImages[0];

  const handleAddToCart = async () => {
    if (!isLoggedIn || !userId) {
      toast.info("Please log in to add items to your cart");
      router.push("/login");
      return;
    }

    if (product.hasSize && !selectedSize) {
      toast.warning("Please select a size");
      return;
    }

    setIsAdding(true);

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `http://localhost:8800/api/users/${userId}/cart/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: quantity,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.errCode !== 0) {
        throw new Error(result.message || "Failed to add item to cart");
      }

      toast.success(`Added ${quantity} item(s) to cart!`);
      setQuantity(1); // Reset quantity

      // Trigger a custom event to update cart count in header
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add item to cart"
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/shop"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to shop
          </Link>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Images */}
          <section>
            {mainImage && (
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
                <Image
                  src={mainImage.pic_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {product.ProductImages.length > 1 && (
              <div className="flex gap-3">
                {product.ProductImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 bg-white"
                  >
                    <Image
                      src={img.pic_url}
                      alt={`${product.name} thumbnail ${img.display_order}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Details */}
          <section className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              {product.subtitle && (
                <p className="mt-1 text-sm text-gray-500">
                  {product.subtitle}
                </p>
              )}
            </div>

            <div>
              <p className="text-2xl font-bold">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-semibold tracking-wide text-gray-700">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {product.description}
              </p>
            </div>

            {product.hasSize && product.ProductVariants && product.ProductVariants.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-700">
                  Size
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.ProductVariants?.map((variant) => (
                    <label
                      key={variant.id}
                      className={`flex cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                        selectedSize === variant.id
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-800 hover:border-black"
                      }`}
                    >
                      <input
                        type="radio"
                        name="size"
                        value={variant.id}
                        checked={selectedSize === variant.id}
                        onChange={() => setSelectedSize(variant.id)}
                        className="sr-only"
                      />
                      <span>{variant.Size.name}</span>
                      {variant.stock > 0 && (
                        <span className="ml-2 text-xs opacity-75">
                          ({variant.stock} in stock)
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-700">
                Quantity
              </h2>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:border-black transition"
                  disabled={quantity <= 1}
                >
                  <span className="text-lg">−</span>
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:border-black transition"
                >
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding || (product.hasSize && !selectedSize)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Please log in to add items to your cart.
                </p>
                <Link
                  href="/login"
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:bg-gray-900"
                >
                  Login
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

