"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";

interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  Product: {
    id: number;
    name: string;
    subtitle: string;
    description: string;
    price: string;
    ProductImages: Array<{
      id: number;
      pic_url: string;
    }>;
  };
}

interface CartResponse {
  errCode: number;
  message: string;
  data?: {
    cartId: number;
    items: CartItem[];
  };
}

const fetcher = async (url: string): Promise<CartResponse> => {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch cart");
  }
  return res.json();
};

export default function CartPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user?.id) {
        setUserId(user.id);
      } else {
        router.push("/login");
      }
    } catch (error) {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const { data, error, mutate } = useSWR<CartResponse>(
    userId ? `http://localhost:8800/api/users/${userId}/cart` : null,
    fetcher
  );

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `http://localhost:8800/api/users/${userId}/cart/items`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            quantity: newQuantity,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.errCode === 0) {
        toast.success("Quantity updated");
        mutate(); // Refresh cart data
        // Trigger cart update event for header
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error(result.message || "Failed to update quantity");
      }
    } catch (error) {
      toast.error("Failed to update quantity. Please try again.");
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `http://localhost:8800/api/users/${userId}/cart/items/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.errCode === 0) {
        toast.success("Item removed from cart");
        mutate(); // Refresh cart data
        // Trigger cart update event for header
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error(result.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Failed to remove item. Please try again.");
      console.error("Error removing item:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Error loading cart</p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || data.errCode !== 0 || !data.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load cart</p>
        </div>
      </div>
    );
  }

  const cartItems = data.data.items || [];
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.Product.price) * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding some products to your cart!
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const productImage = item.Product.ProductImages?.[0]?.pic_url;
                  const itemTotal =
                    parseFloat(item.Product.price) * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="p-6 flex flex-col sm:flex-row gap-4 hover:bg-gray-50 transition"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/shop/${item.Product.id}`}
                        className="flex-shrink-0"
                      >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-200">
                          <ImageWithFallback
                            src={productImage}
                            alt={item.Product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link
                            href={`/shop/${item.Product.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-gray-700"
                          >
                            {item.Product.name}
                          </Link>
                          {item.Product.subtitle && (
                            <p className="text-sm text-gray-500 mt-1">
                              {item.Product.subtitle}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <p className="text-lg font-bold text-gray-900">
                              ${item.Product.price}
                            </p>
                            <span className="text-sm text-gray-600">
                              × {item.quantity} = ${itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 mr-2">Quantity:</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product_id, item.quantity - 1)
                              }
                              className="p-1 rounded hover:bg-gray-200 transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-lg font-semibold w-10 text-center border border-gray-300 rounded px-2 py-1 bg-gray-50">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product_id, item.quantity + 1)
                              }
                              className="p-1 rounded hover:bg-gray-200 transition"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-lg font-semibold text-gray-900">
                              ${itemTotal.toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeItem(item.product_id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full mt-6 px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition font-medium">
                  Proceed to Checkout
                </button>
                <Link
                  href="/shop"
                  className="block w-full text-center mt-4 text-gray-600 hover:text-gray-900 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

