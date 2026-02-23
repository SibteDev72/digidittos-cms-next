"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { caseStudiesApi } from "@/lib/api/services/caseStudies";
import type { CreateCaseStudyData, UpdateCaseStudyData } from "@/models/caseStudy";

// Dynamic import to avoid SSR issues with TipTap
const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] animate-pulse rounded-lg border border-gray-300 bg-gray-50" />
    ),
  }
);

interface CaseStudyFormProps {
  caseStudyId?: string;
}

export default function CaseStudyForm({ caseStudyId }: CaseStudyFormProps) {
  const router = useRouter();
  const isEditing = Boolean(caseStudyId);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    "draft"
  );
  const [publishedAt, setPublishedAt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywordsInput, setMetaKeywordsInput] = useState("");

  useEffect(() => {
    if (!caseStudyId) return;
    const fetchCaseStudy = async () => {
      try {
        const res = await caseStudiesApi.getById(caseStudyId);
        const cs = res.data;
        setTitle(cs.title);
        setDescription(cs.description);
        setExcerpt(cs.excerpt || "");
        setFeaturedImage(cs.featuredImage || "");
        setTagsInput(cs.tags?.join(", ") || "");
        setStatus(cs.status);
        setPublishedAt(
          cs.publishedAt
            ? new Date(cs.publishedAt).toISOString().slice(0, 16)
            : ""
        );
        setMetaTitle(cs.seo?.metaTitle || "");
        setMetaDescription(cs.seo?.metaDescription || "");
        setMetaKeywordsInput(cs.seo?.metaKeywords?.join(", ") || "");
      } catch {
        setErrors(["Failed to load case study"]);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudy();
  }, [caseStudyId]);

  const parseTags = (input: string) =>
    input
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      const tags = parseTags(tagsInput);
      const metaKeywords = parseTags(metaKeywordsInput);

      const data: CreateCaseStudyData | UpdateCaseStudyData = {
        title,
        description,
        status,
        tags,
        seo: {
          metaTitle: metaTitle || undefined,
          metaDescription: metaDescription || undefined,
          metaKeywords: metaKeywords.length > 0 ? metaKeywords : undefined,
        },
      };

      if (excerpt) data.excerpt = excerpt;
      if (featuredImage) data.featuredImage = featuredImage;
      if (publishedAt) data.publishedAt = new Date(publishedAt).toISOString();

      if (isEditing && caseStudyId) {
        await caseStudiesApi.update(caseStudyId, data);
      } else {
        await caseStudiesApi.create(data as CreateCaseStudyData);
      }

      router.push("/case-studies");
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      if (axiosError.response?.data?.errors) {
        setErrors(axiosError.response.data.errors);
      } else {
        setErrors([
          axiosError.response?.data?.message || "Failed to save case study",
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
            <p key={i} className="text-sm text-red-700">
              {error}
            </p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - Left Column */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter case study title"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                />
              </div>

              <div>
                <label
                  htmlFor="excerpt"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  maxLength={300}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Brief summary (auto-generated from description if left blank)"
                />
                <p className="mt-1 text-xs text-gray-400">
                  {excerpt.length}/300
                </p>
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-secondary">
              SEO Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="metaTitle"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Meta Title
                </label>
                <input
                  id="metaTitle"
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  maxLength={70}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="SEO title (auto-generated from title if left blank)"
                />
                <p className="mt-1 text-xs text-gray-400">
                  {metaTitle.length}/70
                </p>
              </div>
              <div>
                <label
                  htmlFor="metaDescription"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Meta Description
                </label>
                <textarea
                  id="metaDescription"
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  maxLength={160}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="SEO description (auto-generated from description if left blank)"
                />
                <p className="mt-1 text-xs text-gray-400">
                  {metaDescription.length}/160
                </p>
              </div>
              <div>
                <label
                  htmlFor="metaKeywords"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Meta Keywords
                </label>
                <input
                  id="metaKeywords"
                  type="text"
                  value={metaKeywordsInput}
                  onChange={(e) => setMetaKeywordsInput(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Comma-separated keywords
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-5">
          {/* Publish Settings */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-secondary">
              Publish
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="status"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as typeof status)}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="publishedAt"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Published At
                </label>
                <input
                  id="publishedAt"
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Auto-set when published if left blank
                </p>
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
                      ? "Update"
                      : status === "published"
                        ? "Publish"
                        : "Save Draft"}
                </button>
                <Link
                  href="/case-studies"
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-secondary">
              Featured Image
            </h3>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Image URL (e.g. /uploads/image.jpg)"
            />
            {featuredImage && (
              <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="h-32 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-secondary">Tags</h3>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="tag1, tag2, tag3"
            />
            <p className="mt-1 text-xs text-gray-400">Comma-separated tags</p>
            {tagsInput && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {parseTags(tagsInput).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
