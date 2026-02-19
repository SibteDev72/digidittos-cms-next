import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Sign In</h1>
      <p className="text-gray-600">Login form will be implemented here.</p>
    </div>
  );
}
