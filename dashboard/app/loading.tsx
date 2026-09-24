export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Page Header Skeleton */}
      <div>
        <div className="h-7 w-32 animate-pulse rounded-md bg-gray-200" />

        <div className="mt-2 h-4 w-72 animate-pulse rounded-md bg-gray-200" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

                <div className="mt-3 h-9 w-16 animate-pulse rounded bg-gray-200" />
              </div>

              <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
            </div>

            <div className="mt-4 h-3 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid gap-6 xl:grid-cols-2">
        {[1, 2].map((section) => (
          <div
            key={section}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="border-b border-gray-100 p-5">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

              <div className="mt-2 h-3 w-56 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="divide-y divide-gray-100">
              {[1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="flex-1">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />

                    <div className="mt-2 h-3 w-48 animate-pulse rounded bg-gray-200" />

                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-200" />
                  </div>

                  <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Skeleton */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />

          <div className="mt-2 h-3 w-56 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div>
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />

                <div className="mt-2 h-3 w-40 animate-pulse rounded bg-gray-200" />
              </div>

              <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}