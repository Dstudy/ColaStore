"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide header on login and register pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }
  
  return <Header />;
}

