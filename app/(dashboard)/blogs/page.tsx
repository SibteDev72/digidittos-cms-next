import type { Metadata } from "next";
import BlogsListClient from "./BlogsListClient";

export const metadata: Metadata = {
  title: "Blogs",
};

export default function BlogsPage() {
  return <BlogsListClient />;
}
