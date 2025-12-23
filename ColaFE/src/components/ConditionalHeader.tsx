"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Hide header on login, register, and admin pages
  if (pathname === "/login" || pathname === "/register" || pathname?.startsWith("/admin")) {
    return null;
  }

  return <Header />;
}

