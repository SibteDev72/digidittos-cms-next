import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-secondary">Digidittos CMS</h1>
        <p className="mt-2 text-sm text-gray-500">
          Sign in to your account
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
