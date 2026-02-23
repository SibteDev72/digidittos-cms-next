import type { Metadata } from "next";
import CreateUserForm from "./CreateUserForm";

export const metadata: Metadata = {
  title: "Create User",
};

export default function CreateUserPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Create User</h1>
        <p className="mt-1 text-sm text-gray-500">Add a new user to the system</p>
      </div>
      <CreateUserForm />
    </div>
  );
}
