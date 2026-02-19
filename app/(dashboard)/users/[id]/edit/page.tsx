import type { Metadata } from "next";
import EditUserForm from "./EditUserForm";

export const metadata: Metadata = {
  title: "Edit User",
};

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
        <p className="mt-1 text-sm text-gray-500">Update user information</p>
      </div>
      <EditUserForm userId={id} />
    </div>
  );
}
