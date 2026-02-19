import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">Digidittos CMS</h1>
      <p className="text-lg text-gray-600">
        Content Management System
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded bg-gray-900 px-6 py-3 text-white hover:bg-gray-800"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
