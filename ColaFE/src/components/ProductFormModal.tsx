"use client";

import { useState, useEffect } from "react";
import { X, Save, Upload } from "lucide-react";
import { toast } from "react-toastify";

interface ProductType {
    id: number;
    name: string;
    description: string;
}

interface ProductFormData {
    name: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    "3DUrl": string;
    price: string;
    hasSize: boolean;
    isFeatured: boolean;
    active: boolean;
    productTypeId: string;
}

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: any; // For editing existing product
    mode: "create" | "edit";
}

const initialFormData: ProductFormData = {
    name: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    "3DUrl": "",
    price: "",
    hasSize: false,
    isFeatured: false,
    active: true,
    productTypeId: "",
};

export default function ProductFormModal({
    isOpen,
    onClose,
    onSuccess,
    product,
    mode,
}: ProductFormModalProps) {
    const [formData, setFormData] = useState<ProductFormData>(initialFormData);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTypes, setIsLoadingTypes] = useState(false);

    // Fetch product types on component mount
    useEffect(() => {
        if (isOpen) {
            fetchProductTypes();
        }
    }, [isOpen]);

    // Populate form data when editing
    useEffect(() => {
        if (mode === "edit" && product) {
            // Extract image URL from ProductImages array
            const imageUrl = product.ProductImages && product.ProductImages.length > 0 
                ? product.ProductImages[0].pic_url 
                : "";

            setFormData({
                name: product.name || "",
                subtitle: product.subtitle || "",
                description: product.description || "",
                imageUrl: imageUrl,
                "3DUrl": product["3DUrl"] || "",
                price: product.price?.toString() || "",
                hasSize: product.hasSize || false,
                isFeatured: product.isFeatured || false,
                active: product.active !== undefined ? product.active : true,
                productTypeId: product.productTypeId?.toString() || "",
            });
        } else {
            setFormData(initialFormData);
        }
    }, [mode, product]);

    const fetchProductTypes = async () => {
        setIsLoadingTypes(true);
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch("http://localhost:8800/api/admin/product-types", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch product types");
            }

            const result = await response.json();
            if (result.errCode === 0 && result.productTypes) {
                setProductTypes(result.productTypes);
            }
        } catch (error) {
            console.error("Error fetching product types:", error);
            toast.error("Failed to load product categories");
        } finally {
            setIsLoadingTypes(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name.trim()) {
            toast.error("Product name is required");
            return;
        }
        
        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast.error("Valid price is required");
            return;
        }

        if (!formData.productTypeId) {
            toast.error("Product category is required");
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("auth_token");
            const url = mode === "create" 
                ? "http://localhost:8800/api/admin/products"
                : `http://localhost:8800/api/admin/products/${product.id}`;
            
            const method = mode === "create" ? "POST" : "PUT";

            const submitData = {
                ...formData,
                price: parseFloat(formData.price),
                productTypeId: parseInt(formData.productTypeId),
            };

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(submitData),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${mode} product`);
            }

            const result = await response.json();
            if (result.errCode === 0) {
                toast.success(`Product ${mode === "create" ? "created" : "updated"} successfully`);
                onSuccess();
                onClose();
            } else {
                toast.error(result.message || `Failed to ${mode} product`);
            }
        } catch (error) {
            console.error(`${mode} error:`, error);
            toast.error(`Failed to ${mode} product`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === "create" ? "Create New Product" : "Edit Product"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Product Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                            Subtitle
                        </label>
                        <input
                            type="text"
                            id="subtitle"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter product subtitle"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter product description"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                            Image URL
                        </label>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com/product-image.jpg"
                        />
                        {formData.imageUrl && (
                            <div className="mt-2">
                                <img
                                    src={formData.imageUrl}
                                    alt="Product preview"
                                    className="w-20 h-20 object-cover rounded-md border"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Price and Category Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($) *
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        {/* Product Type */}
                        <div>
                            <label htmlFor="productTypeId" className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                id="productTypeId"
                                name="productTypeId"
                                value={formData.productTypeId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                disabled={isLoadingTypes}
                            >
                                <option value="">Select a category</option>
                                {productTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 3D URL */}
                    <div>
                        <label htmlFor="3DUrl" className="block text-sm font-medium text-gray-700 mb-2">
                            3D Model URL
                        </label>
                        <input
                            type="url"
                            id="3DUrl"
                            name="3DUrl"
                            value={formData["3DUrl"]}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com/model.glb"
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="hasSize"
                                name="hasSize"
                                checked={formData.hasSize}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="hasSize" className="ml-2 block text-sm text-gray-700">
                                Has Size Variants
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                                Featured Product
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                                Active Product
                            </label>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {mode === "create" ? "Creating..." : "Updating..."}
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {mode === "create" ? "Create Product" : "Update Product"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}