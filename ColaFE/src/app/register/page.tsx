"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

interface RegisterResponse {
  errCode: number;
  message: string;
  user?: {
    id: number;
    fullname: string;
    email: string;
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullname || !email || !password) {
      toast.error("Full name, email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8800/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, email, password }),
      });

      const data: RegisterResponse = await res.json();

      if (!res.ok || data.errCode !== 0) {
        toast.error(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! Redirecting to login...");
      setLoading(false);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-semibold mb-2 text-gray-900 text-center">
          Create account
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Join ColaStore to start shopping
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full name
            </label>
            <input
              id="fullname"
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-black hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}


