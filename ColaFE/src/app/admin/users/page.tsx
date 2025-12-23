"use client";

import { useState } from "react";
import useSWR from "swr";
import AdminLayout from "@/components/AdminLayout";
import { User, Mail, Phone, Calendar, Shield, Eye } from "lucide-react";
import { toast } from "react-toastify";

// Types
interface UserData {
    id: number;
    email: string;
    fullname: string;
    phonenumber: string | null;
    address: string | null;
    role_id: number;
    createdAt: string;
    updatedAt: string;
}

interface UsersResponse {
    users: UserData[];
}

// Fetcher
const fetcher = async (url: string): Promise<UsersResponse> => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }
    return res.json();
};

// Role badge component
const RoleBadge = ({ roleId }: { roleId: number }) => {
    const isAdmin = roleId === 1;
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${isAdmin
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
                }`}
        >
            <Shield size={12} />
            {isAdmin ? "Admin" : "User"}
        </span>
    );
};

export default function AdminUsersPage() {
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, error, isLoading } = useSWR<UsersResponse>(
        "http://localhost:8800/api/get-all-users",
        fetcher,
        {
            refreshInterval: 30000, // Refresh every 30 seconds
        }
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading users...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-red-600 text-lg mb-2">Error loading users</p>
                        <p className="text-gray-600">{error.message}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const users = data?.users || [];

    // Filter users based on search query
    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            user.fullname?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.phonenumber?.toLowerCase().includes(query)
        );
    });

    // Count users by role
    const adminCount = users.filter((u) => u.role_id === 1).length;
    const userCount = users.filter((u) => u.role_id !== 1).length;

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
                    <p className="text-gray-600">Manage user accounts and permissions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                            </div>
                            <div className="bg-indigo-100 p-3 rounded-full">
                                <User className="text-indigo-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Admins</p>
                                <p className="text-3xl font-bold text-purple-600">{adminCount}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Shield className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Regular Users</p>
                                <p className="text-3xl font-bold text-gray-600">{userCount}</p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-full">
                                <User className="text-gray-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        Showing {filteredUsers.length} of {users.length} users
                    </p>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">#{user.id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <User className="text-indigo-600" size={20} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.fullname || "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 flex items-center gap-1">
                                                    <Mail size={14} className="text-gray-400" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 flex items-center gap-1">
                                                    <Phone size={14} className="text-gray-400" />
                                                    {user.phonenumber || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <RoleBadge roleId={user.role_id} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 flex items-center gap-1">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {formatDate(user.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                                >
                                                    <Eye size={16} />
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* User Avatar */}
                            <div className="flex justify-center">
                                <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <User className="text-indigo-600" size={48} />
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">User ID</p>
                                        <p className="text-sm font-medium text-gray-900">#{selectedUser.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedUser.fullname || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Mail size={14} /> Email
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedUser.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Phone size={14} /> Phone Number
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedUser.phonenumber || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <div className="mt-1">
                                            <RoleBadge roleId={selectedUser.role_id} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedUser.address || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Calendar size={20} />
                                    Account Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Created At</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(selectedUser.createdAt).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Last Updated</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(selectedUser.updatedAt).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
