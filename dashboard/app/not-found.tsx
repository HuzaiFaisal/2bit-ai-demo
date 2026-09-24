import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="text-7xl font-bold tracking-tight text-gray-200">
          404
        </div>

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Page not found
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          The page you are looking for doesn't exist or may have
          been moved.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Go to Overview
          </Link>

          <Link
            href="/calls"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            View Calls
          </Link>
        </div>
      </div>
    </div>
  );
}