"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { Package, Calendar, MapPin, DollarSign, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { createPortal } from "react-dom"

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
    products?: Product[]; // Backend returns "products" not "data"
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
    const { data, error, mutate } = useSWR<ProductsResponse>("http://localhost:8800/api/admin/products", fetcher);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (error) {
            console.error("Error fetching products:", error);
            setIsLoading(false);
        } else if (data) {
            console.log("Products data received:", data);
            setProducts(data.products || []); // Changed from data.data to data.products
            setIsLoading(false);
        }
    }, [data, error]);

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            setIsAuthenticated(false);
            router.push("/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleEditProduct = (productId: number) => {
        router.push(`/admin/products/${productId}`);
    }

    return (
        <>
            <div>
                <h1>Products</h1>

                {isLoading && <p>Loading products...</p>}

                {error && (
                    <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '5px' }}>
                        <p>Error loading products: {error.message}</p>
                    </div>
                )}

                {!isLoading && !error && products.length === 0 && (
                    <p>No products found.</p>
                )}

                {!isLoading && !error && products.length > 0 && (
                    <div>
                        {products.map(product => (
                            <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                                <h2>{product.name}</h2>
                                <p><strong>Description:</strong> {product.description}</p>
                                <p><strong>Price:</strong> ${product.price}</p>
                                <p><strong>Stock:</strong> {product.stock_quantity}</p>
                                <p><strong>Category ID:</strong> {product.category_id}</p>
                                <p><strong>Image URL:</strong> {product.image_url}</p>
                                <button onClick={() => handleEditProduct(product.id)}>Edit</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}