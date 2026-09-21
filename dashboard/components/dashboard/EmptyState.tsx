interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export default function EmptyState({
  title,
  description,
  icon = "○",
}: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500">
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}