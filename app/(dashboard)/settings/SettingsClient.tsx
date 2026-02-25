"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { usersApi } from "@/lib/api/services/users";
import { swalSuccess, swalError } from "@/lib/swal";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "password", label: "Password" },
] as const;

type Tab = (typeof tabs)[number]["id"];

export default function SettingsClient() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile fields
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);

    try {
      await usersApi.update(user._id, { name, avatar: avatar || undefined });
      await refreshUser();
      swalSuccess("Profile updated!");
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      const msg =
        axiosError.response?.data?.errors?.join(", ") ||
        axiosError.response?.data?.message ||
        "Failed to update profile";
      swalError("Update failed", msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      swalError(
        "Passwords don't match",
        "New password and confirm password must be the same."
      );
      return;
    }

    setSavingPassword(true);

    try {
      await usersApi.update(user._id, { password: newPassword });
      setNewPassword("");
      setConfirmPassword("");
      swalSuccess("Password updated!");
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      const msg =
        axiosError.response?.data?.errors?.join(", ") ||
        axiosError.response?.data?.message ||
        "Failed to update password";
      swalError("Update failed", msg);
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* User Header */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-16 w-16 rounded-full border-2 border-gray-100 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-secondary">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "border-b-2 pb-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleProfileSubmit}
          className="rounded-xl border border-gray-200 bg-white"
        >
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-secondary">
              Profile Information
            </h3>
            <p className="mt-0.5 text-xs text-gray-400">
              Update your personal details
            </p>
          </div>

          <div className="space-y-5 p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  disabled
                  value={user.email}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="avatar"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Avatar URL
              </label>
              <div className="flex items-center gap-4">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="h-12 w-12 flex-shrink-0 rounded-full border border-gray-200 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <input
                  id="avatar"
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-gray-100 px-6 py-4">
            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {activeTab === "password" && (
        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-xl border border-gray-200 bg-white"
        >
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-secondary">
              Change Password
            </h3>
            <p className="mt-0.5 text-xs text-gray-400">
              Ensure your account stays secure
            </p>
          </div>

          <div className="space-y-5 p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="mb-2 text-xs font-medium text-gray-600">
                Password requirements:
              </p>
              <ul className="space-y-1 text-xs text-gray-400">
                <li className="flex items-center gap-1.5">
                  <span className={cn("inline-block h-1 w-1 rounded-full", newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300")} />
                  Minimum 8 characters
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={cn("inline-block h-1 w-1 rounded-full", /[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300")} />
                  One uppercase letter
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={cn("inline-block h-1 w-1 rounded-full", /[a-z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300")} />
                  One lowercase letter
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={cn("inline-block h-1 w-1 rounded-full", /[0-9]/.test(newPassword) ? "bg-green-500" : "bg-gray-300")} />
                  One number
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={cn("inline-block h-1 w-1 rounded-full", /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "bg-green-500" : "bg-gray-300")} />
                  One special character
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-gray-100 px-6 py-4">
            <button
              type="submit"
              disabled={savingPassword}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
