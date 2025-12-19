"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "../../public/logo/logo.png";
import Image from "next/image";
import { User, ShoppingCart } from "lucide-react";

interface CartResponse {
  errCode: number;
  message: string;
  data?: {
    cartId: number;
    items: any[];
  };
}

interface UserData {
  id: number;
  fullname: string;
  email: string;
  role_id: string;
}

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr) {
      setIsLoggedIn(true);
      try {
        const user: UserData = JSON.parse(userStr);
        if (user?.id) {
          setUserId(user.id);
        }
        if (user?.fullname) {
          setUserName(user.fullname);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserId(null);
    setUserName("");
    setCartItemCount(0);
    setShowDropdown(false);
    router.push("/");
  };

  const fetchCartItems = async () => {
    if (!isLoggedIn || !userId) return;
    
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `http://localhost:8800/api/users/${userId}/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: CartResponse = await response.json();
      
      if (data.errCode === 0 && data.data?.items) {
        setCartItemCount(data.data.items.length);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    // Fetch cart items when user is logged in
    if (isLoggedIn && userId) {
      fetchCartItems();
    }
  }, [isLoggedIn, userId]);

  useEffect(() => {
    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCartItems();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [isLoggedIn, userId]);

  const links = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Contact", href: "/contact" },
  ];

  const navlinks = links.map((link) => (
    <a key={link.name} href={link.href} className="nav-link">
      {link.name}
    </a>
  ));

  return (
    <header>
      <div className="sticky w-full flex z-10 p-10">
        <div className="flex-3 justify-start flex">
          <div className="logo-wrapper justify-start">
            <Image
              src={Logo.src}
              alt="Logo"
              className="logo-image"
              width={150}
              height={43}
            />
          </div>
          <nav className="nav-links flex gap-5">{navlinks}</nav>
        </div>
        <div className="flex-1 justify-end">
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link href="/cart" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          Hi, {userName}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Manage Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href="/login"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
