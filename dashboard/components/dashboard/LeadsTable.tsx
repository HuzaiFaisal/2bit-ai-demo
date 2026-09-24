"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface LeadsTableProps {
  leads: any[];
}

function formatBudget(budget: number | null) {
  if (!budget) return "Not specified";

  return `SAR ${budget.toLocaleString()}`;
}

export default function LeadsTable({
  leads,
}: LeadsTableProps) {
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "all" | "new" | "qualified" | "contacted" | "won" | "lost"
  >("all");

  const filteredLeads = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return leads.filter((lead) => {
      const customerName =
        lead.customer?.name?.toLowerCase() || "";

      const phone =
        lead.customer?.mobile?.toLowerCase() || "";

      const vehicle =
        lead.preferred_vehicle?.toLowerCase() || "";

      const interest =
        lead.interest?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        customerName.includes(searchValue) ||
        phone.includes(searchValue) ||
        vehicle.includes(searchValue) ||
        interest.includes(searchValue);

      const matchesFilter =
        filter === "all"
          ? true
          : lead.status?.toLowerCase() === filter;

      return matchesSearch && matchesFilter;
    });
  }, [leads, search, filter]);

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              All Leads
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {filteredLeads.length} lead
              {filteredLeads.length === 1 ? "" : "s"} found
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search customer, phone or vehicle..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 lg:w-96"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            {
              label: "All",
              value: "all",
            },
            {
              label: "New",
              value: "new",
            },
            {
              label: "Qualified",
              value: "qualified",
            },
            {
              label: "Contacted",
              value: "contacted",
            },
            {
              label: "Won",
              value: "won",
            },
            {
              label: "Lost",
              value: "lost",
            },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setFilter(
                  item.value as
                    | "all"
                    | "new"
                    | "qualified"
                    | "contacted"
                    | "won"
                    | "lost"
                )
              }
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                filter === item.value
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Customer
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Interest
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Vehicle
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Budget
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Purchase Timeline
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Source
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">
                        {lead.customer?.name ||
                          "Unknown customer"}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {lead.customer?.mobile || "—"}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {lead.interest || "—"}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-gray-700">
                      {lead.preferred_vehicle || "—"}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatBudget(lead.budget)}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {lead.purchase_timeline || "—"}
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {lead.source || "Unknown"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={lead.status} />
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="text-sm font-medium text-gray-900 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500">
              ◉
            </div>

            <h3 className="text-sm font-semibold text-gray-900">
              No leads found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}