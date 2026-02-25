import type { Metadata } from "next";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and password
        </p>
      </div>
      <SettingsClient />
    </div>
  );
}
