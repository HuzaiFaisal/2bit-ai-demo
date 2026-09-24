export default function TopBar() {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="pl-12 md:pl-0">
        <h1 className="text-sm font-semibold text-gray-900">
          2BIT AI Dashboard
        </h1>

        <p className="text-xs text-gray-500">
          AI-powered customer and sales operations
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden text-right sm:block">
          <div className="text-sm font-medium text-gray-900">
            Noura
          </div>

          <div className="text-xs text-gray-500">
            AI Sales Assistant
          </div>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
          N
        </div>

        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
      </div>
    </header>
  );
}