import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content",
};

export default function ContentPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Content Management</h1>
      <p className="text-gray-600">Content listing and management will be implemented here.</p>
    </div>
  );
}
