"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import AdminLayout from "@/components/AdminLayout";

// Types
interface MetricData {
  value: number;
  growth_rate: number;
  previous_value: number;
}

interface MonthlyRevenueData {
  period: string;
  month_name: string;
  revenue: number;
}

interface TopProductData {
  rank: number;
  product_name: string;
  sales: number;
  revenue: number;
}

interface DashboardMetrics {
  summary: {
    total_revenue: MetricData;
    total_orders: MetricData;
    total_customers: MetricData;
    total_products: MetricData;
  };
  monthly_revenue: MonthlyRevenueData[];
  top_products: TopProductData[];
}

interface DashboardResponse {
  success: boolean;
  data: DashboardMetrics;
  message: string;
}

// Fetcher function
const fetcher = async (url: string): Promise<DashboardResponse> => {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return res.json();
};

export default function AdminDashboardPage() {
  const { data, error, mutate } = useSWR<DashboardResponse>(
    "http://localhost:8800/api/admin/analytics/dashboard",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (data || error) {
      setIsLoading(false);
    }
  }, [data, error]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // First update analytics
      const token = localStorage.getItem("auth_token");
      const updateRes = await fetch(
        "http://localhost:8800/api/admin/analytics/update",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (updateRes.ok) {
        // Then refresh the dashboard data
        await mutate();
        toast.success("Dashboard refreshed successfully!");
      } else {
        toast.error("Failed to refresh dashboard");
      }
    } catch (err) {
      console.error("Error refreshing dashboard:", err);
      toast.error("Error refreshing dashboard");
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const formatGrowthRate = (rate: number) => {
    const formatted = Math.abs(rate).toFixed(1);
    return rate >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 gap-4 text-center">
          <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
          <p>{error.message}</p>
          <button
            onClick={() => mutate()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium cursor-pointer transition-colors hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }


  const metrics = data?.data;

  return (
    <AdminLayout>
      <div className="dashboard-container">
        {/* Page Header */}
        <div className="page-header flex flex-horizontal justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
          >
            <RefreshCw
              size={20}
              className={isRefreshing ? "animate-spin" : ""}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex gap-4 border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="w-15 h-15 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
              <DollarSign size={24} />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Total Revenue</p>
              <h2 className="text-3xl font-bold text-gray-900">
                {formatCurrency(metrics?.summary.total_revenue.value || 0)}
              </h2>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${(metrics?.summary.total_revenue.growth_rate || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {(metrics?.summary.total_revenue.growth_rate || 0) >= 0 ? (
                  <ArrowUp size={16} />
                ) : (
                  <ArrowDown size={16} />
                )}
                <span>
                  {formatGrowthRate(
                    metrics?.summary.total_revenue.growth_rate || 0
                  )}{" "}
                  from last period
                </span>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex gap-4 border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="w-15 h-15 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 text-white flex items-center justify-center flex-shrink-0">
              <ShoppingCart size={24} />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Total Orders</p>
              <h2 className="text-3xl font-bold text-gray-900">
                {formatNumber(metrics?.summary.total_orders.value || 0)}
              </h2>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${(metrics?.summary.total_orders.growth_rate || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {(metrics?.summary.total_orders.growth_rate || 0) >= 0 ? (
                  <ArrowUp size={16} />
                ) : (
                  <ArrowDown size={16} />
                )}
                <span>
                  {formatGrowthRate(
                    metrics?.summary.total_orders.growth_rate || 0
                  )}{" "}
                  from last period
                </span>
              </div>
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex gap-4 border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="w-15 h-15 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center flex-shrink-0">
              <Users size={24} />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Total Customers</p>
              <h2 className="text-3xl font-bold text-gray-900">
                {formatNumber(metrics?.summary.total_customers.value || 0)}
              </h2>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${(metrics?.summary.total_customers.growth_rate || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {(metrics?.summary.total_customers.growth_rate || 0) >= 0 ? (
                  <ArrowUp size={16} />
                ) : (
                  <ArrowDown size={16} />
                )}
                <span>
                  {formatGrowthRate(
                    metrics?.summary.total_customers.growth_rate || 0
                  )}{" "}
                  from last period
                </span>
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex gap-4 border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="w-15 h-15 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <Package size={24} />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Total Products</p>
              <h2 className="text-3xl font-bold text-gray-900">
                {formatNumber(metrics?.summary.total_products.value || 0)}
              </h2>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${(metrics?.summary.total_products.growth_rate || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {(metrics?.summary.total_products.growth_rate || 0) >= 0 ? (
                  <ArrowUp size={16} />
                ) : (
                  <ArrowDown size={16} />
                )}
                <span>
                  {formatGrowthRate(
                    metrics?.summary.total_products.growth_rate || 0
                  )}{" "}
                  from last period
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Top Selling Products</h3>
            <Package size={20} className="text-indigo-600" />
          </div>
          <div className="min-h-[300px]">
            {metrics?.top_products && metrics.top_products.length > 0 ? (
              <div className="flex flex-col gap-4">
                {metrics.top_products.map((product) => (
                  <div
                    key={product.rank}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg transition-all hover:translate-x-1 hover:shadow-md"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      #{product.rank}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">
                        {product.product_name}
                      </h4>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-600">
                          {formatNumber(product.sales)} units sold
                        </span>
                        <span className="text-indigo-600 font-semibold">
                          {formatCurrency(product.revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-52 text-gray-400 italic">
                No top products data available
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
