"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    ArrowUp,
    ArrowDown,
    RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

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
            <div className="dashboard-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
                <style jsx>{`
          .dashboard-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem;
          }
          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            color: white;
            gap: 1rem;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="error-state">
                    <h2>Error Loading Dashboard</h2>
                    <p>{error.message}</p>
                    <button onClick={() => mutate()} className="retry-button">
                        Retry
                    </button>
                </div>
                <style jsx>{`
          .dashboard-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem;
          }
          .error-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            color: white;
            gap: 1rem;
            text-align: center;
          }
          .retry-button {
            padding: 0.75rem 1.5rem;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
          }
          .retry-button:hover {
            transform: scale(1.05);
          }
        `}</style>
            </div>
        );
    }

    const metrics = data?.data;

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Admin Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Welcome back! Here's what's happening with your store.
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="refresh-button"
                >
                    <RefreshCw
                        size={20}
                        className={isRefreshing ? "spinning" : ""}
                    />
                    {isRefreshing ? "Refreshing..." : "Refresh Data"}
                </button>
            </div>

            {/* Metrics Cards */}
            <div className="metrics-grid">
                {/* Total Revenue */}
                <div className="metric-card revenue-card">
                    <div className="metric-icon-wrapper revenue-icon">
                        <DollarSign size={24} />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Total Revenue</p>
                        <h2 className="metric-value">
                            {formatCurrency(metrics?.summary.total_revenue.value || 0)}
                        </h2>
                        <div
                            className={`metric-growth ${(metrics?.summary.total_revenue.growth_rate || 0) >= 0
                                    ? "positive"
                                    : "negative"
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
                <div className="metric-card orders-card">
                    <div className="metric-icon-wrapper orders-icon">
                        <ShoppingCart size={24} />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Total Orders</p>
                        <h2 className="metric-value">
                            {formatNumber(metrics?.summary.total_orders.value || 0)}
                        </h2>
                        <div
                            className={`metric-growth ${(metrics?.summary.total_orders.growth_rate || 0) >= 0
                                    ? "positive"
                                    : "negative"
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
                <div className="metric-card customers-card">
                    <div className="metric-icon-wrapper customers-icon">
                        <Users size={24} />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Total Customers</p>
                        <h2 className="metric-value">
                            {formatNumber(metrics?.summary.total_customers.value || 0)}
                        </h2>
                        <div
                            className={`metric-growth ${(metrics?.summary.total_customers.growth_rate || 0) >= 0
                                    ? "positive"
                                    : "negative"
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
                <div className="metric-card products-card">
                    <div className="metric-icon-wrapper products-icon">
                        <Package size={24} />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Total Products</p>
                        <h2 className="metric-value">
                            {formatNumber(metrics?.summary.total_products.value || 0)}
                        </h2>
                        <div
                            className={`metric-growth ${(metrics?.summary.total_products.growth_rate || 0) >= 0
                                    ? "positive"
                                    : "negative"
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

            {/* Charts Section */}
            <div className="charts-section">
                {/* Monthly Revenue Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Monthly Revenue</h3>
                        <TrendingUp size={20} className="chart-icon" />
                    </div>
                    <div className="chart-content">
                        {metrics?.monthly_revenue && metrics.monthly_revenue.length > 0 ? (
                            <div className="bar-chart">
                                {metrics.monthly_revenue.map((month, index) => {
                                    const maxRevenue = Math.max(
                                        ...metrics.monthly_revenue.map((m) => m.revenue)
                                    );
                                    const heightPercentage = (month.revenue / maxRevenue) * 100;

                                    return (
                                        <div key={index} className="bar-wrapper">
                                            <div className="bar-container">
                                                <div
                                                    className="bar"
                                                    style={{ height: `${heightPercentage}%` }}
                                                >
                                                    <span className="bar-value">
                                                        {formatCurrency(month.revenue)}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="bar-label">{month.month_name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="no-data">No monthly revenue data available</p>
                        )}
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Top Selling Products</h3>
                        <Package size={20} className="chart-icon" />
                    </div>
                    <div className="chart-content">
                        {metrics?.top_products && metrics.top_products.length > 0 ? (
                            <div className="top-products-list">
                                {metrics.top_products.map((product) => (
                                    <div key={product.rank} className="product-item">
                                        <div className="product-rank">#{product.rank}</div>
                                        <div className="product-info">
                                            <h4 className="product-name">{product.product_name}</h4>
                                            <div className="product-stats">
                                                <span className="product-sales">
                                                    {formatNumber(product.sales)} units sold
                                                </span>
                                                <span className="product-revenue">
                                                    {formatCurrency(product.revenue)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-data">No top products data available</p>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .dashboard-subtitle {
          color: rgba(255, 255, 255, 0.9);
          margin: 0.5rem 0 0 0;
          font-size: 1.1rem;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .refresh-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .refresh-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .metric-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .metric-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .revenue-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .orders-icon {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }

        .customers-icon {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }

        .products-icon {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          color: white;
        }

        .metric-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .metric-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .metric-growth {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .metric-growth.positive {
          color: #10b981;
        }

        .metric-growth.negative {
          color: #ef4444;
        }

        .charts-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .chart-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .chart-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .chart-icon {
          color: #667eea;
        }

        .chart-content {
          min-height: 300px;
        }

        .bar-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 300px;
          gap: 0.5rem;
        }

        .bar-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .bar-container {
          flex: 1;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .bar {
          width: 100%;
          max-width: 60px;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px 8px 0 0;
          position: relative;
          transition: all 0.3s ease;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 0.5rem;
          min-height: 40px;
        }

        .bar:hover {
          filter: brightness(1.1);
          transform: scaleY(1.02);
        }

        .bar-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          white-space: nowrap;
        }

        .bar-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          text-align: center;
        }

        .top-products-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .product-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .product-item:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .product-rank {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.125rem;
          flex-shrink: 0;
        }

        .product-info {
          flex: 1;
        }

        .product-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .product-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
        }

        .product-sales {
          color: #6b7280;
        }

        .product-revenue {
          color: #667eea;
          font-weight: 600;
        }

        .no-data {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #9ca3af;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }

          .dashboard-title {
            font-size: 2rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .charts-section {
            grid-template-columns: 1fr;
          }

          .bar-chart {
            gap: 0.25rem;
          }

          .bar {
            max-width: 40px;
          }

          .bar-value {
            font-size: 0.625rem;
          }
        }
      `}</style>
        </div>
    );
}
