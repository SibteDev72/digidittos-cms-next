import type { Metadata } from "next";
import BlogForm from "../BlogForm";

export const metadata: Metadata = {
  title: "Create Blog",
};

export default function CreateBlogPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Create Blog Post</h1>
        <p className="mt-1 text-sm text-gray-500">
          Write and publish a new blog post
        </p>
      </div>
      <BlogForm />
    </div>
  );
}
