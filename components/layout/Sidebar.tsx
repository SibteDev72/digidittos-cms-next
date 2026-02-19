"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Content", href: "/content" },
  { label: "Media", href: "/media" },
  { label: "Users", href: "/users", adminOnly: true },
  { label: "Settings", href: "/settings", adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col">
      <div className="border-b border-gray-200 p-6">
        <Link href="/dashboard">
          <h2 className="text-lg font-bold text-gray-900">Digidittos CMS</h2>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems
            .filter((item) => !item.adminOnly || user?.role === "admin")
            .map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      {user && (
        <div className="border-t border-gray-200 p-4">
          <div className="mb-3">
            <p className="truncate text-sm font-medium text-gray-900">
              {user.name}
            </p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
            <span className="mt-1 inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">
              {user.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
