export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will be added here */}
      <aside className="hidden w-64 border-r bg-white md:block">
        <div className="p-6">
          <h2 className="text-lg font-bold">Digidittos CMS</h2>
        </div>
        <nav className="px-4">
          {/* Navigation items will be added here */}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
