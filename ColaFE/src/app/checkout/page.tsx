"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";
import { toast } from "react-toastify";
import { ShoppingBag, MapPin, Truck, CreditCard, ChevronRight } from "lucide-react";

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

interface OrderPayload {
    province: string;
    district: string;
    ward: string;
    address: string;
    delivery_date?: string;
    note?: string;
    shipping_cost: number;
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

export default function CheckoutPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState<OrderPayload>({
        province: "",
        district: "",
        ward: "",
        address: "",
        delivery_date: "",
        note: "",
        shipping_cost: 5.00, // Default shipping cost
    });

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user?.id) {
                setUserId(user.id);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const { data, error } = useSWR<CartResponse>(
        userId ? `http://localhost:8800/api/users/${userId}/cart` : null,
        fetcher
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            toast.error("User not authenticated");
            return;
        }

        // Validation
        if (!formData.province || !formData.district || !formData.ward || !formData.address) {
            toast.error("Please fill in all required address fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(
                `http://localhost:8800/api/users/${userId}/orders`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();

            if (response.ok && result.errCode === 0) {
                toast.success("Order placed successfully!");
                // Trigger cart update event for header
                window.dispatchEvent(new Event("cartUpdated"));
                // Redirect to orders page or order detail
                setTimeout(() => {
                    router.push(`/orders`);
                }, 1500);
            } else {
                toast.error(result.message || "Failed to create order");
            }
        } catch (error) {
            toast.error("Failed to place order. Please try again.");
            console.error("Error creating order:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Please login to checkout
                        </h2>
                        <p className="text-gray-600 mb-6">
                            You need to be logged in to complete your purchase.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-2">Error loading cart</p>
                    <p className="text-gray-600">{error.message}</p>
                </div>
            </div>
        );
    }

    if (!data || data.errCode !== 0 || !data.data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">Unable to load cart</p>
                </div>
            </div>
        );
    }

    const cartItems = data.data.items || [];

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Add some products to your cart before checking out.
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

    const subtotal = cartItems.reduce((sum, item) => {
        return sum + parseFloat(item.Product.price) * item.quantity;
    }, 0);

    const shippingCost = formData.shipping_cost;
    const total = subtotal + shippingCost;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
                    <div className="flex items-center text-sm text-gray-600">
                        <Link href="/cart" className="hover:text-gray-900">Cart</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-gray-900 font-medium">Checkout</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        Shipping Address
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Province <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="province"
                                            value={formData.province}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                            placeholder="Enter province"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            District <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                            placeholder="Enter district"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ward <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="ward"
                                            value={formData.ward}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                            placeholder="Enter ward"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Delivery Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            name="delivery_date"
                                            value={formData.delivery_date}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                            placeholder="Enter street address"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Options */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        Delivery Options
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    <div
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition ${formData.shipping_cost === 5.0
                                            ? "border-black bg-gray-50"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        onClick={() =>
                                            setFormData((prev) => ({ ...prev, shipping_cost: 5.0 }))
                                        }
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-900">Standard Delivery</p>
                                                <p className="text-sm text-gray-600">3-5 business days</p>
                                            </div>
                                            <p className="font-bold text-gray-900">$5.00</p>
                                        </div>
                                    </div>

                                    <div
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition ${formData.shipping_cost === 10.0
                                            ? "border-black bg-gray-50"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        onClick={() =>
                                            setFormData((prev) => ({ ...prev, shipping_cost: 10.0 }))
                                        }
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-900">Express Delivery</p>
                                                <p className="text-sm text-gray-600">1-2 business days</p>
                                            </div>
                                            <p className="font-bold text-gray-900">$10.00</p>
                                        </div>
                                    </div>

                                    <div
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition ${formData.shipping_cost === 0
                                            ? "border-black bg-gray-50"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        onClick={() =>
                                            setFormData((prev) => ({ ...prev, shipping_cost: 0 }))
                                        }
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-900">Store Pickup</p>
                                                <p className="text-sm text-gray-600">Pick up at our store</p>
                                            </div>
                                            <p className="font-bold text-green-600">FREE</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        Order Notes
                                    </h2>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        name="note"
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                                        placeholder="Any special instructions for your order?"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                    Order Summary
                                </h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => {
                                        const productImage = item.Product.ProductImages?.[0]?.pic_url;
                                        const itemTotal = parseFloat(item.Product.price) * item.quantity;

                                        return (
                                            <div key={item.id} className="flex gap-3">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                    <ImageWithFallback
                                                        src={productImage}
                                                        alt={item.Product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {item.Product.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        ${itemTotal.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>
                                            {shippingCost === 0 ? (
                                                <span className="text-green-600 font-semibold">FREE</span>
                                            ) : (
                                                `$${shippingCost.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between text-xl font-bold text-gray-900">
                                            <span>Total</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-6 px-6 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Processing...
                                        </span>
                                    ) : (
                                        "Place Order"
                                    )}
                                </button>

                                <Link
                                    href="/cart"
                                    className="block w-full text-center mt-4 text-gray-600 hover:text-gray-900 transition"
                                >
                                    ← Back to Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}