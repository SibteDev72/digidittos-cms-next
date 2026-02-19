import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media",
};

export default function MediaPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Media Library</h1>
      <p className="text-gray-600">Media upload and management will be implemented here.</p>
    </div>
  );
}
