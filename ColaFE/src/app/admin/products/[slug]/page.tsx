"use client";

import { use } from "react";
import useSWR from "swr";
import AdminLayout from "@/components/AdminLayout";
import { Package, DollarSign, Tag, Image, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";

// Types
interface ProductImage {
    id: number;
    product_id: number;
    pic_url: string;
    display_order: number;
}

interface ProductType {
    id: number;
    name: string;
    description: string;
}

interface ProductVariant {
    id: number;
    product_id: number;
    size_id: number | null;
    stock: number;
    Size?: {
        id: number;
        name: string;
    };
}

interface Product {
    id: number;
    name: string;
    subtitle: string | null;
    description: string | null;
    "3DUrl": string | null;
    price: string;
    hasSize: boolean;
    isFeatured: boolean;
    active: boolean;
    productTypeId: number;
    createdAt: string;
    updatedAt: string;
    ProductType?: ProductType;
    ProductImages?: ProductImage[];
    ProductVariants?: ProductVariant[];
}

interface ProductResponse {
    errCode: number;
    message: string;
    product: Product;
}

// Fetcher
const fetcher = async (url: string): Promise<ProductResponse> => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch product");
    }
    return res.json();
};

export default function ProductAdminDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const productId = slug;

    const { data, error, isLoading } = useSWR<ProductResponse>(
        `http://localhost:8800/api/admin/products/${productId}`,
        fetcher
    );

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading product...</p>
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
                        <p className="text-red-600 text-lg mb-2">Error loading product</p>
                        <p className="text-gray-600">{error.message}</p>
                        <Link
                            href="/admin/products"
                            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                        >
                            <ArrowLeft size={16} />
                            Back to Products
                        </Link>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!data || data.errCode !== 0 || !data.product) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-gray-600">Product not found</p>
                        <Link
                            href="/admin/products"
                            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                        >
                            <ArrowLeft size={16} />
                            Back to Products
                        </Link>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const product = data.product;
    const totalStock = product.ProductVariants?.reduce((sum, variant) => sum + variant.stock, 0) || 0;

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4"
                    >
                        <ArrowLeft size={16} />
                        Back to Products
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Details</h1>
                    <p className="text-gray-600">View and manage product information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Product Images */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Image size={20} />
                                Product Images
                            </h2>

                            {product.ProductImages && product.ProductImages.length > 0 ? (
                                <div className="space-y-4">
                                    {product.ProductImages.map((img, index) => (
                                        <div key={img.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                            <ImageWithFallback
                                                src={img.pic_url}
                                                alt={`${product.name} - Image ${index + 1}`}
                                                fill
                                                className="object-contain"
                                            />
                                            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700">
                                                #{img.display_order}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                    <div className="text-center text-gray-400">
                                        <Package size={48} className="mx-auto mb-2" />
                                        <p className="text-sm">No images available</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Product Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Info size={20} />
                                Basic Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500">Product ID</label>
                                    <p className="text-lg font-medium text-gray-900">#{product.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Product Name</label>
                                    <p className="text-lg font-medium text-gray-900">{product.name}</p>
                                </div>
                                {product.subtitle && (
                                    <div>
                                        <label className="text-sm text-gray-500">Subtitle</label>
                                        <p className="text-gray-900">{product.subtitle}</p>
                                    </div>
                                )}
                                {product.description && (
                                    <div>
                                        <label className="text-sm text-gray-500">Description</label>
                                        <p className="text-gray-900">{product.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pricing & Stock */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <DollarSign size={20} />
                                Pricing & Stock
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-indigo-50 rounded-lg p-4">
                                    <p className="text-sm text-indigo-600 mb-1">Price</p>
                                    <p className="text-2xl font-bold text-indigo-900">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <p className="text-sm text-green-600 mb-1">Total Stock</p>
                                    <p className="text-2xl font-bold text-green-900">{totalStock}</p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <p className="text-sm text-purple-600 mb-1">Variants</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {product.ProductVariants?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Product Variants */}
                        {product.ProductVariants && product.ProductVariants.length > 0 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Package size={20} />
                                    Product Variants
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Variant ID
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Size
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Stock
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {product.ProductVariants.map((variant) => (
                                                <tr key={variant.id}>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        #{variant.id}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {variant.Size?.name || "Default"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                        {variant.stock}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Product Attributes */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Tag size={20} />
                                Product Attributes
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Product Type</p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {product.ProductType?.name || "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Has Sizes</p>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.hasSize
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {product.hasSize ? "Yes" : "No"}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Featured</p>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.isFeatured
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {product.isFeatured ? "Yes" : "No"}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.active
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {product.active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>

                            {product["3DUrl"] && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500 mb-2">3D Model URL</p>
                                    <a
                                        href={product["3DUrl"]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-indigo-600 hover:text-indigo-800 break-all"
                                    >
                                        {product["3DUrl"]}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Timestamps */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Created At</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(product.createdAt).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Last Updated</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(product.updatedAt).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}