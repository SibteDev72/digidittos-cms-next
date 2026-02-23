"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { teamsApi } from "@/lib/api/services/teams";
import type { CreateTeamData, UpdateTeamData, TeamSocial } from "@/models/team";

const PLATFORM_OPTIONS = [
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "website", label: "Website" },
  { value: "dribbble", label: "Dribbble" },
  { value: "behance", label: "Behance" },
];

interface TeamFormProps {
  memberId?: string;
}

export default function TeamForm({ memberId }: TeamFormProps) {
  const router = useRouter();
  const isEditing = Boolean(memberId);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");
  const [socials, setSocials] = useState<TeamSocial[]>([]);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!memberId) return;
    const fetchMember = async () => {
      try {
        const res = await teamsApi.getById(memberId);
        const member = res.data;
        setName(member.name);
        setRole(member.role);
        setPhoto(member.photo || "");
        setBio(member.bio || "");
        setSocials(member.socials || []);
        setDisplayOrder(member.displayOrder);
        setIsActive(member.isActive);
      } catch {
        setErrors(["Failed to load team member"]);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [memberId]);

  const addSocial = () => {
    setSocials([...socials, { platform: "website", url: "" }]);
  };

  const updateSocial = (index: number, field: keyof TeamSocial, value: string) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    setSocials(updated);
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      // Filter out socials with empty URLs
      const validSocials = socials.filter((s) => s.url.trim() !== "");

      const data: CreateTeamData | UpdateTeamData = {
        name,
        role,
        socials: validSocials,
        displayOrder,
        isActive,
      };

      if (photo) data.photo = photo;
      if (bio) data.bio = bio;

      if (isEditing && memberId) {
        await teamsApi.update(memberId, data);
      } else {
        await teamsApi.create(data as CreateTeamData);
      }

      router.push("/teams");
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      if (axiosError.response?.data?.errors) {
        setErrors(axiosError.response.data.errors);
      } else {
        setErrors([
          axiosError.response?.data?.message || "Failed to save team member",
        ]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-red-700">{error}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - Left Column */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Role / Position
                  </label>
                  <input
                    id="role"
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    maxLength={100}
                    className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. CEO & Founder"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={1000}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="A brief bio about this team member..."
                />
                <p className="mt-1 text-xs text-gray-400">{bio.length}/1000</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-secondary">Social Links</h3>
              <button
                type="button"
                onClick={addSocial}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                + Add Social
              </button>
            </div>

            {socials.length === 0 ? (
              <p className="text-sm text-gray-400">No social links added yet.</p>
            ) : (
              <div className="space-y-3">
                {socials.map((social, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <select
                      value={social.platform}
                      onChange={(e) => updateSocial(index, "platform", e.target.value)}
                      className="w-36 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {PLATFORM_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={social.url}
                      onChange={(e) => updateSocial(index, "url", e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => removeSocial(index)}
                      className="rounded-lg border border-red-200 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-5">
          {/* Settings */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-secondary">Settings</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="isActive" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="isActive"
                  value={isActive ? "true" : "false"}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label htmlFor="displayOrder" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Display Order
                </label>
                <input
                  id="displayOrder"
                  type="number"
                  min={0}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="mt-1 text-xs text-gray-400">Lower numbers appear first</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : isEditing
                      ? "Update Member"
                      : "Add Member"}
                </button>
                <Link
                  href="/teams"
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-secondary">Photo</h3>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Image URL (e.g. /uploads/photo.jpg)"
            />
            {photo && (
              <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={photo}
                  alt="Member photo"
                  className="h-32 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
