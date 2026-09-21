interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
            {icon}
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}