"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { blogsApi } from "@/lib/api/services/blogs";
import type { CreateBlogData, UpdateBlogData } from "@/models/blog";
import { swalSuccess, swalError } from "@/lib/swal";
import TagInput from "@/components/ui/TagInput";

// Dynamic import to avoid SSR issues with TipTap
const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-[350px] animate-pulse rounded-lg border border-gray-300 bg-gray-50" /> }
);

interface BlogFormProps {
  blogId?: string;
}

export default function BlogForm({ blogId }: BlogFormProps) {
  const router = useRouter();
  const isEditing = Boolean(blogId);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);

  useEffect(() => {
    if (!blogId) return;
    const fetchBlog = async () => {
      try {
        const res = await blogsApi.getById(blogId);
        const blog = res.data;
        setTitle(blog.title);
        setContent(blog.content);
        setExcerpt(blog.excerpt || "");
        setFeaturedImage(blog.featuredImage || "");
        setTags(blog.tags || []);
        setStatus(blog.status);
        setMetaTitle(blog.seo?.metaTitle || "");
        setMetaDescription(blog.seo?.metaDescription || "");
        setMetaKeywords(blog.seo?.metaKeywords || []);
      } catch {
        swalError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data: CreateBlogData | UpdateBlogData = {
        title,
        content,
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

      if (isEditing && blogId) {
        await blogsApi.update(blogId, data);
      } else {
        await blogsApi.create(data as CreateBlogData);
      }

      swalSuccess(isEditing ? "Blog post updated!" : "Blog post created!");
      router.push("/blogs");
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      const msg = axiosError.response?.data?.errors?.join(", ")
        || axiosError.response?.data?.message
        || "Failed to save blog post";
      swalError("Save failed", msg);
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - Left Column */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter blog post title"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Content
                </label>
                <RichTextEditor content={content} onChange={setContent} />
              </div>

              <div>
                <label htmlFor="excerpt" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  maxLength={300}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Brief summary (auto-generated from content if left blank)"
                />
                <p className="mt-1 text-xs text-gray-400">{excerpt.length}/300</p>
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-secondary">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="metaTitle" className="mb-1.5 block text-sm font-medium text-gray-700">
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
                <p className="mt-1 text-xs text-gray-400">{metaTitle.length}/70</p>
              </div>
              <div>
                <label htmlFor="metaDescription" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  id="metaDescription"
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  maxLength={160}
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="SEO description (auto-generated from content if left blank)"
                />
                <p className="mt-1 text-xs text-gray-400">{metaDescription.length}/160</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Meta Keywords
                </label>
                <TagInput tags={metaKeywords} onChange={setMetaKeywords} placeholder="Add a keyword..." />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-5">
          {/* Publish Settings */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-secondary">Publish</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-gray-700">
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

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : isEditing
                      ? "Update Post"
                      : status === "published"
                        ? "Publish"
                        : "Save Draft"}
                </button>
                <Link
                  href="/blogs"
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-secondary">Featured Image</h3>
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
            <TagInput tags={tags} onChange={setTags} placeholder="Add a tag..." />
          </div>
        </div>
      </div>
    </form>
  );
}
