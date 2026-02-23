import type { Metadata } from "next";
import BlogForm from "../../BlogForm";

export const metadata: Metadata = {
  title: "Edit Blog",
};

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Edit Blog Post</h1>
        <p className="mt-1 text-sm text-gray-500">Update your blog post</p>
      </div>
      <BlogForm blogId={id} />
    </div>
  );
}
