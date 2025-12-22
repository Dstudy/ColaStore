"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { Package, Calendar, MapPin, DollarSign, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

interface Order {
    id: number;
    user_id: number;
    province: string;
    district: string;
    ward: string;
    address: string;
    order_date: string;
    delivery_date: string | null;
    status: string;
    note: string | null;
    subtotal: string;
    shipping_cost: string;
    total_amount: string;
}

interface OrdersResponse {
    errCode: number;
    message: string;
    data?: Order[];
}

const fetcher = async (url: string): Promise<OrdersResponse> => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch orders");
    }
    return res.json();
};

const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
        case "PENDING":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "PROCESSING":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "SHIPPED":
            return "bg-purple-100 text-purple-800 border-purple-200";
        case "DELIVERED":
            return "bg-green-100 text-green-800 border-green-200";
        case "CANCELLED":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

export default function OrdersPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    const { data, error, mutate } = useSWR<OrdersResponse>(
        userId ? `http://localhost:8800/api/users/${userId}/orders` : null,
        fetcher
    );

    const handleCancelOrder = async (orderId: number) => {
        if (!confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(
                `http://localhost:8800/api/users/${userId}/orders/${orderId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (response.ok && result.errCode === 0) {
                toast.success("Order cancelled successfully");
                mutate(); // Refresh orders list
            } else {
                toast.error(result.message || "Failed to cancel order");
            }
        } catch (error) {
            toast.error("Failed to cancel order. Please try again.");
            console.error("Error cancelling order:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h1>
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Please login to view your orders
                        </h2>
                        <p className="text-gray-600 mb-6">
                            You need to be logged in to access your order history.
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
                    <p className="text-red-600 text-lg mb-2">Error loading orders</p>
                    <p className="text-gray-600">{error.message}</p>
                </div>
            </div>
        );
    }

    if (!data || data.errCode !== 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">Unable to load orders</p>
                </div>
            </div>
        );
    }

    const orders = data.data || [];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">View and manage your order history</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            No orders yet
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Start shopping to create your first order!
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                            >
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Order ID</p>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    #{order.id}
                                                </p>
                                            </div>
                                            <div className="h-8 w-px bg-gray-300"></div>
                                            <div>
                                                <p className="text-sm text-gray-600">Order Date</p>
                                                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(order.order_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <span
                                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Shipping Address */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                Shipping Address
                                            </h3>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>{order.address}</p>
                                                <p>
                                                    {order.ward}, {order.district}
                                                </p>
                                                <p>{order.province}</p>
                                            </div>
                                            {order.delivery_date && (
                                                <div className="mt-3">
                                                    <p className="text-sm text-gray-600">
                                                        Expected Delivery:{" "}
                                                        <span className="font-medium text-gray-900">
                                                            {new Date(order.delivery_date).toLocaleDateString()}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Order Summary */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                Order Summary
                                            </h3>
                                            <div className="text-sm space-y-2">
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Subtotal</span>
                                                    <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Shipping</span>
                                                    <span>
                                                        {parseFloat(order.shipping_cost) === 0 ? (
                                                            <span className="text-green-600 font-semibold">
                                                                FREE
                                                            </span>
                                                        ) : (
                                                            `$${parseFloat(order.shipping_cost).toFixed(2)}`
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="border-t border-gray-200 pt-2">
                                                    <div className="flex justify-between text-base font-bold text-gray-900">
                                                        <span>Total</span>
                                                        <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Note */}
                                    {order.note && (
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                                Order Notes
                                            </h3>
                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                                {order.note}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition text-center font-medium flex items-center justify-center gap-2"
                                        >
                                            View Details
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                        {order.status === "PENDING" && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="flex-1 px-4 py-2 bg-white border border-red-300 text-red-600 rounded hover:bg-red-50 transition font-medium"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
