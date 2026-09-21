"use client";

interface CallsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CallsSearch({
  value,
  onChange,
}: CallsSearchProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search customer or phone..."
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 sm:w-80"
      />
    </div>
  );
}