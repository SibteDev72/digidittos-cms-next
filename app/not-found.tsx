import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-gray-600">Page not found</p>
      <Link
        href="/"
        className="rounded bg-primary px-4 py-2 text-white hover:bg-primary-dark"
      >
        Go Home
      </Link>
    </div>
  );
}
