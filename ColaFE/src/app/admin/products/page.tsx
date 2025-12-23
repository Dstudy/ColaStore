"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { Package, Calendar, MapPin, DollarSign, ChevronRight, Eye, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import AdminLayout from "@/components/AdminLayout";
import ProductFormModal from "@/components/ProductFormModal";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    stock_quantity: number;
    category_id: number;
    image_url: string;
}

interface ProductsResponse {
    errCode: number;
    message: string;
    products?: Product[];
}

const fetcher = async (url: string): Promise<ProductsResponse> => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }
    return res.json();
};

export default function AdminProductsPage() {
    const router = useRouter();
    const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
        "http://localhost:8800/api/admin/products",
        fetcher
    );

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleCreateNew = () => {
        setModalMode("create");
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setModalMode("edit");
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleModalSuccess = () => {
        mutate(); // Refresh the products list
    };

    const handleDelete = async (productId: number, productName: string) => {
        if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`http://localhost:8800/api/admin/products/${productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            const result = await response.json();
            if (result.errCode === 0) {
                toast.success("Product deleted successfully");
                mutate(); // Refresh the products list
            } else {
                toast.error(result.message || "Failed to delete product");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete product");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading products...</p>
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
                        <p className="text-red-600 text-lg mb-2">Error loading products</p>
                        <p className="text-gray-600">{error.message}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!data || data.errCode !== 0 || !data.products) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-gray-600">No products available</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const products = data.products;

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
                        <p className="text-gray-600">Manage your product inventory</p>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Product
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">${product.price}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                                    title="Edit Product"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Product Form Modal */}
            <ProductFormModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={handleModalSuccess}
                product={selectedProduct}
                mode={modalMode}
            />
        </AdminLayout>
    );
}