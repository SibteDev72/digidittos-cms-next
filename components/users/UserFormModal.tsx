"use client";

import { useState, useEffect, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { usersApi } from "@/lib/api/services/users";
import type { UpdateUserData } from "@/models/user";
import { swalSuccess, swalError } from "@/lib/swal";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId?: string | null;
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
      <path d="M10.748 13.93l2.523 2.524a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clipRule="evenodd" />
    </svg>
  );
}

function getPasswordStrength(pwd: string): number {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
const STRENGTH_TEXT_COLORS = ["", "text-red-500", "text-orange-400", "text-yellow-500", "text-green-600"];

export default function UserFormModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
}: UserFormModalProps) {
  const isEditing = !!userId;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isActive: true,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch user data when editing, reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", email: "", password: "", isActive: true });
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirm(false);
      return;
    }

    if (isEditing && userId) {
      setLoading(true);
      usersApi
        .getById(userId)
        .then((res) => {
          setFormData({
            name: res.data.name,
            email: res.data.email,
            password: "",
            isActive: res.data.isActive,
          });
        })
        .catch(() => swalError("Failed to load user data"))
        .finally(() => setLoading(false));
    }
  }, [isOpen, userId, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== confirmPassword) {
      swalError("Passwords don't match", "Please make sure both password fields are identical.");
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing && userId) {
        const updateData: UpdateUserData = {
          name: formData.name,
          email: formData.email,
          isActive: formData.isActive,
        };
        if (formData.password) updateData.password = formData.password;
        await usersApi.update(userId, updateData);
      } else {
        await usersApi.create(formData);
      }
      swalSuccess(isEditing ? "User updated!" : "User created!");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      const msg = axiosError.response?.data?.errors?.join(", ")
        || axiosError.response?.data?.message
        || `Failed to ${isEditing ? "update" : "create"} user`;
      swalError("Save failed", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const strength = getPasswordStrength(formData.password);
  const showStrength = formData.password.length > 0;
  const showConfirmField = !isEditing || formData.password.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit User" : "Add User"}
      maxWidth="md"
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="modal-name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="modal-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="modal-email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="modal-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="modal-password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Password{isEditing && <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>}
              </label>
              <div className="relative">
                <input
                  id="modal-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required={!isEditing}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    isEditing
                      ? "Leave blank to keep current password"
                      : "Min 8 chars, uppercase, number, special"
                  }
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 pr-10 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {/* Strength meter */}
              {showStrength && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          level <= strength ? STRENGTH_COLORS[strength] : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`mt-1 text-xs font-medium ${STRENGTH_TEXT_COLORS[strength]}`}>
                    {STRENGTH_LABELS[strength]}
                  </p>
                </div>
              )}

              {!showStrength && (
                <p className="mt-1 text-xs text-gray-400">
                  {isEditing
                    ? "Leave blank to keep existing password."
                    : "Must be at least 8 characters with uppercase, lowercase, number, and special character."}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            {showConfirmField && (
              <div>
                <label
                  htmlFor="modal-confirm-password"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="modal-confirm-password"
                    type={showConfirm ? "text" : "password"}
                    required={!isEditing || formData.password.length > 0}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className={`block w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm text-secondary focus:outline-none focus:ring-1 ${
                      confirmPassword && confirmPassword !== formData.password
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:border-primary focus:ring-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                {confirmPassword && confirmPassword !== formData.password && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                id="modal-isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="modal-isActive"
                className="text-sm font-medium text-gray-700"
              >
                Active account
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Create User"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
