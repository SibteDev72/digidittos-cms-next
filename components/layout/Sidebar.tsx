"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { cn } from "@/lib/utils/cn";
import { swalConfirm } from "@/lib/swal";

const navItems = [
  // { label: "Dashboard", href: "/dashboard" },
  { label: "Blogs", href: "/blogs" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Team", href: "/teams" },
  { label: "Users", href: "/users" },
  { label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    const confirmed = await swalConfirm(
      "Sign Out",
      "Are you sure you want to sign out?",
      "Yes, sign out",
      "#00859b",
    );
    if (confirmed) logout();
  };

  return (
    <aside className="hidden w-64 flex-shrink-0 bg-secondary md:flex md:flex-col">
      <div className="border-b border-white/10 p-6">
        <Link href="/dashboard">
          <h2 className="text-lg font-bold text-white">Digidittos CMS</h2>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white",
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
        <div className="border-t border-white/10 p-4">
          <div className="mb-3">
            <p className="truncate text-sm font-medium text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
