"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usersApi } from "@/lib/api/services/users";
import type { User, UpdateUserData } from "@/models/user";

export default function EditUserForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "editor" | "author" | "viewer",
    isActive: true,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await usersApi.getById(userId);
        setUser(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          password: "",
          role: res.data.role,
          isActive: res.data.isActive,
        });
      } catch {
        setErrors(["Failed to load user"]);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      const updateData: UpdateUserData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
      };

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      await usersApi.update(userId, updateData);
      router.push("/users");
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      if (axiosError.response?.data?.errors) {
        setErrors(axiosError.response.data.errors);
      } else {
        setErrors([
          axiosError.response?.data?.message || "Failed to update user",
        ]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">User not found.</p>
        <Link
          href="/users"
          className="mt-3 inline-block text-sm font-medium text-gray-900 underline"
        >
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl rounded-xl border border-gray-200 bg-white p-6"
    >
      {errors.length > 0 && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-red-700">
              {error}
            </p>
          ))}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="Leave blank to keep current password"
          />
          <p className="mt-1 text-xs text-gray-400">
            Leave blank to keep existing password. New passwords must be at least 8 characters with uppercase, lowercase, number, and special character.
          </p>
        </div>

        <div>
          <label
            htmlFor="role"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          >
            <option value="viewer">Viewer</option>
            <option value="author">Author</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Active
          </label>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
        <Link
          href="/users"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
