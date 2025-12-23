"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    LogOut,
} from "lucide-react";
import { toast } from "react-toastify";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Check if user is admin
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) {
            // Not logged in, redirect to login
            router.push("/login");
            return;
        }

        try {
            const user = JSON.parse(userStr);
            // Check if user is admin (role_id === 1)
            if (Number(user.role_id) !== 1) {
                // Not an admin, redirect to homepage
                toast.error("Access denied. Admin privileges required.");
                router.push("/");
                return;
            }
            // User is admin, allow access
            setIsAuthorized(true);
        } catch (e) {
            // Invalid user data, redirect to login
            router.push("/login");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        router.push("/login");
    };

    const navItems = [
        {
            name: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
        },
        {
            name: "Products",
            href: "/admin/products",
            icon: Package,
        },
        {
            name: "Orders",
            href: "/admin/orders",
            icon: ShoppingCart,
        },
        {
            name: "Users",
            href: "/admin/users",
            icon: Users,
        },
    ];

    // Show loading or nothing while checking authorization
    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 z-40 w-64 bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col md:w-64 sm:w-20">
                {/* Sidebar Header */}
                <div className="px-6 py-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 sm:text-base sm:writing-mode-vertical">
                        ColaStore Admin
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 font-medium text-[15px] ${isActive
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40"
                                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="px-4 py-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3.5 bg-transparent text-red-400 border border-red-400/30 rounded-lg font-medium text-[15px] cursor-pointer transition-all duration-200 hover:bg-red-400/10 hover:border-red-400"
                    >
                        <LogOut size={20} />
                        <span className="">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
