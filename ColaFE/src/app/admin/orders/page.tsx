"use client";

import { useState } from "react";
import useSWR from "swr";
import AdminLayout from "@/components/AdminLayout";
import { Eye, Package, Calendar, MapPin, User, Phone, Mail } from "lucide-react";
import { toast } from "react-toastify";

// Types
interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price_at_purchase: string;
    Product: {
        id: number;
        name: string;
        price: string;
    };
}

interface OrderUser {
    id: number;
    email: string;
    fullname: string;
    phonenumber: string;
}

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
    createdAt: string;
    updatedAt: string;
    User: OrderUser;
    OrderItems: OrderItem[];
    item_count: number;
    total_quantity: number;
}

interface OrdersResponse {
    errCode: number;
    message: string;
    data: Order[];
}

// Fetcher
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

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "PROCESSING":
                return "bg-blue-100 text-blue-800";
            case "SHIPPED":
                return "bg-purple-100 text-purple-800";
            case "DELIVERED":
                return "bg-green-100 text-green-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {status}
        </span>
    );
};

export default function AdminOrdersPage() {
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const { data, error, isLoading, mutate } = useSWR<OrdersResponse>(
        "http://localhost:8800/api/admin/orders",
        fetcher,
        {
            refreshInterval: 30000, // Refresh every 30 seconds
        }
    );

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch(`http://localhost:8800/api/admin/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }

            toast.success("Order status updated successfully");
            mutate(); // Refresh data
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Failed to update order status");
        }
    };

    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(Number(value));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading orders...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-red-600 text-lg mb-2">Error loading orders</p>
                        <p className="text-gray-600">{error.message}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const orders = data?.data || [];
    const filteredOrders = statusFilter === "ALL"
        ? orders
        : orders.filter((order) => order.status === statusFilter);

    const statuses = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
                    <p className="text-gray-600">View and manage customer orders</p>
                </div>

                {/* Filter */}
                <div className="mb-6 flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-500">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </span>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.User?.fullname || "N/A"}
                                                </div>
                                                <div className="text-sm text-gray-500">{order.User?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(order.order_date)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className="text-xs font-semibold px-2 py-1 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="PROCESSING">PROCESSING</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {order.item_count} items ({order.total_quantity} qty)
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(order.total_amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                                >
                                                    <Eye size={16} />
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Order #{selectedOrder.id}
                            </h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <User size={20} />
                                    Customer Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedOrder.User?.fullname || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Mail size={14} /> Email
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedOrder.User?.email || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Phone size={14} /> Phone
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedOrder.User?.phonenumber || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin size={20} />
                                    Delivery Address
                                </h3>
                                <p className="text-sm text-gray-900">
                                    {selectedOrder.address}, {selectedOrder.ward}, {selectedOrder.district},{" "}
                                    {selectedOrder.province}
                                </p>
                            </div>

                            {/* Order Details */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Calendar size={20} />
                                    Order Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order Date</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatDate(selectedOrder.order_date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <div className="mt-1">
                                            <StatusBadge status={selectedOrder.status} />
                                        </div>
                                    </div>
                                    {selectedOrder.delivery_date && (
                                        <div>
                                            <p className="text-sm text-gray-500">Delivery Date</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(selectedOrder.delivery_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    {selectedOrder.note && (
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-gray-500">Note</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedOrder.note}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Package size={20} />
                                    Order Items
                                </h3>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Product
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Price
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Quantity
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {selectedOrder.OrderItems?.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {item.Product?.name || "N/A"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {formatCurrency(item.price_at_purchase)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                        {formatCurrency(
                                                            Number(item.price_at_purchase) * item.quantity
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(selectedOrder.subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping Cost</span>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(selectedOrder.shipping_cost)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-indigo-600">
                                            {formatCurrency(selectedOrder.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
