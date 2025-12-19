"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UserData {
  id: number;
  fullname: string;
  email: string;
  role_id: string;
}

interface UpdateUserResponse {
  errCode: number;
  message: string;
  user?: UserData;
}

interface UpdatePasswordResponse {
  errCode: number;
  message: string;
  user?: UserData;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Profile update form
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Password change form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const userData: UserData = JSON.parse(userStr);
      setUser(userData);
      setFullname(userData.fullname);
      setEmail(userData.email);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullname.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    if (!user) return;

    setIsUpdatingProfile(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("http://localhost:8800/api/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user.id,
          fullname: fullname.trim(),
          email: email.trim(),
        }),
      });

      const data: UpdateUserResponse = await response.json();

      if (data.errCode !== 0) {
        toast.error(data.message || "Failed to update profile");
        return;
      }

      if (data.user) {
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (oldPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    if (!user) return;

    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        "http://localhost:8800/api/update-user-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: user.id,
            oldPassword: oldPassword,
            newPassword: newPassword,
          }),
        }
      );

      const data: UpdatePasswordResponse = await response.json();

      if (data.errCode !== 0) {
        toast.error(data.message || "Failed to change password");
        return;
      }

      toast.success("Password changed successfully!");
      // Clear password fields
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update your profile information and change your password
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Update Section */}
          <div className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Profile Information
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>

          {/* Password Change Section */}
          <div className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter new password (min. 6 characters)"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

