import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Digidittos CMS</h1>
        <p className="mt-2 text-sm text-gray-500">
          Sign in to your account
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
