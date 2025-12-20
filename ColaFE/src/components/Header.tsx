"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "../../public/logo/logo.png";
import Image from "next/image";
import { User, ShoppingCart, Menu, X } from "lucide-react";

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showDropdown || showMobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, showMobileMenu]);

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
    <Link
      key={link.name}
      href={link.href}
      className="text-white/90 hover:text-white font-medium text-sm transition-colors duration-200 relative group"
    >
      {link.name}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
    </Link>
  ));

  return (
    <>
      <header className="w-full border-b border-white/10 bg-gradient-to-b from-black to-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-4 sm:gap-8 lg:gap-12">
            <Link href="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
              <Image
                src={Logo.src}
                alt="Coca-Cola Logo"
                className="logo-image"
                width={150}
                height={43}
                priority
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navlinks}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2.5 rounded-full hover:bg-white/10 transition-all duration-200 text-white"
              aria-label="Menu"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full hover:bg-white/10 transition-all duration-200 group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2.5 rounded-full hover:bg-white/10 transition-all duration-200 group"
                aria-label="User Menu"
              >
                <User className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {isLoggedIn ? (
                    <>
                      <div className="px-5 py-4 bg-gradient-to-r from-red-600 to-red-700">
                        <p className="text-sm font-semibold text-white">
                          Welcome back!
                        </p>
                        <p className="text-sm text-white/90 mt-0.5 truncate">
                          {userName}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/account"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <span className="font-medium">Manage Account</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-150"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-2">
                      <Link
                        href="/login"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center justify-center px-5 py-3 mx-3 mt-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="md:hidden fixed inset-x-0 top-20 bg-black/98 backdrop-blur-md border-b border-white/10 z-40 animate-in slide-in-from-top duration-200"
        >
          <nav className="flex flex-col px-4 py-6 space-y-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setShowMobileMenu(false)}
                className="text-white/90 hover:text-white font-medium text-base py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
