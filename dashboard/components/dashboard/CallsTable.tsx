"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface CallsTableProps {
    calls: any[];
}

function formatDuration(seconds: number | null) {
    if (!seconds) {
        return "—";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatDateTime(dateString: string | null) {
    if (!dateString) {
        return "—";
    }

    return new Date(dateString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export default function CallsTable({
    calls,
}: CallsTableProps) {
    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState<
        "all" | "completed" | "ai_resolved" | "human_handoff"
    >("all");

    const filteredCalls = useMemo(() => {
        const searchValue = search.toLowerCase().trim();

        return calls.filter((call) => {
            const customerName =
                call.customer?.name?.toLowerCase() || "";

            const phone =
                call.customer_phone?.toLowerCase() || "";

            const matchesSearch =
                !searchValue ||
                customerName.includes(searchValue) ||
                phone.includes(searchValue);

            const matchesFilter =
                filter === "all"
                    ? true
                    : filter === "completed"
                        ? call.status === "completed"
                        : filter === "ai_resolved"
                            ? call.needs_human === false
                            : call.needs_human === true;

            return matchesSearch && matchesFilter;
        });
    }, [calls, search, filter]);

    return (
        <div>
            <div className="mb-4 flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">
                            All Calls
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {filteredCalls.length} call
                            {filteredCalls.length === 1 ? "" : "s"} found
                        </p>
                    </div>

                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search customer or phone..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 sm:w-80"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {[
                        { label: "All", value: "all" },
                        { label: "Completed", value: "completed" },
                        { label: "AI Resolved", value: "ai_resolved" },
                        { label: "Human Handoff", value: "human_handoff" },
                    ].map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() =>
                                setFilter(
                                    item.value as
                                    | "all"
                                    | "completed"
                                    | "ai_resolved"
                                    | "human_handoff"
                                )
                            }
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${filter === item.value
                                ? "bg-gray-900 text-white"
                                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {filteredCalls.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Customer
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Phone
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Duration
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Intent
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Vehicle
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Lead Quality
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Human Handoff
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredCalls.map((call) => (
                                    <tr
                                        key={call.id}
                                        className="transition hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-4">
                                            <Link
                                                href={`/calls/${call.id}`}
                                                className="font-medium text-gray-900 hover:underline"
                                            >
                                                {call.customer?.name || "Unknown customer"}
                                            </Link>
                                        </td>

                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {call.customer_phone || "—"}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {formatDuration(call.duration_seconds)}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {call.customer_intent || "—"}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {call.vehicle_interest || "—"}
                                        </td>

                                        <td className="px-4 py-4">
                                            <StatusBadge status={call.lead_quality} />
                                        </td>

                                        <td className="px-4 py-4">
                                            <StatusBadge status={call.status} />
                                        </td>

                                        <td className="px-4 py-4">
                                            {call.needs_human ? (
                                                <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                                                    Required
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                                    AI Resolved
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {formatDateTime(call.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-sm font-medium text-gray-900">
                            No matching calls
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Try another customer name or phone number.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}