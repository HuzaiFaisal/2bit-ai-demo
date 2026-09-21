interface StatusBadgeProps {
  status: string | null | undefined;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase() || "unknown";

  let classes =
    "bg-gray-100 text-gray-700";

  if (
    normalizedStatus === "completed" ||
    normalizedStatus === "confirmed" ||
    normalizedStatus === "won" ||
    normalizedStatus === "active"
  ) {
    classes = "bg-green-50 text-green-700";
  }

  if (
    normalizedStatus === "pending" ||
    normalizedStatus === "new" ||
    normalizedStatus === "contacted"
  ) {
    classes = "bg-yellow-50 text-yellow-700";
  }

  if (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "lost" ||
    normalizedStatus === "failed"
  ) {
    classes = "bg-red-50 text-red-700";
  }

  if (
    normalizedStatus === "qualified" ||
    normalizedStatus === "warm"
  ) {
    classes = "bg-blue-50 text-blue-700";
  }

  if (normalizedStatus === "hot") {
    classes = "bg-orange-50 text-orange-700";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${classes}`}
    >
      {status || "Unknown"}
    </span>
  );
}