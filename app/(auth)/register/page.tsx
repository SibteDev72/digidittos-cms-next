import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Create Account</h1>
      <p className="text-gray-600">Registration form will be implemented here.</p>
    </div>
  );
}
