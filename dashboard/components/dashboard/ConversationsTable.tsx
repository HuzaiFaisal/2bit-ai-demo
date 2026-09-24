"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface ConversationsTableProps {
  calls: any[];
}

interface Conversation {
  id: string;
  customerName: string;
  phone: string;
  channel: string;
  status: string;
  assignedTo: string;
  lastUpdated: string | null;
  needsHuman: boolean;
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

function buildConversations(calls: any[]): Conversation[] {
  return calls.map((call) => ({
    id: call.id,
    customerName:
      call.customer?.name || "Unknown customer",
    phone: call.customer_phone || call.customer?.mobile || "—",
    channel: "Voice",
    status: call.needs_human
      ? "Human Handoff"
      : call.status || "Unknown",
    assignedTo: call.needs_human
      ? "Sales Team"
      : "Noura",
    lastUpdated: call.created_at,
    needsHuman: call.needs_human === true,
  }));
}

export default function ConversationsTable({
  calls,
}: ConversationsTableProps) {
  const [search, setSearch] = useState("");

  const [channelFilter, setChannelFilter] = useState<
    "all" | "voice"
  >("all");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed" | "human"
  >("all");

  const conversations = useMemo(
    () => buildConversations(calls),
    [calls]
  );

  const filteredConversations = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return conversations.filter((conversation) => {
      const matchesSearch =
        !searchValue ||
        conversation.customerName
          .toLowerCase()
          .includes(searchValue) ||
        conversation.phone
          .toLowerCase()
          .includes(searchValue);

      const matchesChannel =
        channelFilter === "all"
          ? true
          : conversation.channel.toLowerCase() ===
            channelFilter;

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "human"
          ? conversation.needsHuman
          : statusFilter === "completed"
          ? conversation.status.toLowerCase() ===
            "completed"
          : conversation.status.toLowerCase() ===
            "active";

      return (
        matchesSearch &&
        matchesChannel &&
        matchesStatus
      );
    });
  }, [
    conversations,
    search,
    channelFilter,
    statusFilter,
  ]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              All Conversations
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {filteredConversations.length} conversation
              {filteredConversations.length === 1
                ? ""
                : "s"}{" "}
              found
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search customer or phone..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 lg:w-80"
          />
        </div>

        {/* Channel filters */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Channel
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              {
                label: "All Channels",
                value: "all",
              },
              {
                label: "Voice",
                value: "voice",
              },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setChannelFilter(
                    item.value as "all" | "voice"
                  )
                }
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  channelFilter === item.value
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status filters */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Status
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              {
                label: "All",
                value: "all",
              },
              {
                label: "Completed",
                value: "completed",
              },
              {
                label: "Human Handoff",
                value: "human",
              },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setStatusFilter(
                    item.value as
                      | "all"
                      | "active"
                      | "completed"
                      | "human"
                  )
                }
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  statusFilter === item.value
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredConversations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Customer
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Channel
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Assigned To
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Last Updated
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredConversations.map(
                  (conversation) => (
                    <tr
                      key={conversation.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {conversation.customerName}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {conversation.phone}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm">
                            ☎
                          </span>

                          {conversation.channel}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {conversation.needsHuman ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                            Human Handoff
                          </span>
                        ) : (
                          <StatusBadge
                            status={conversation.status}
                          />
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {conversation.assignedTo}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDateTime(
                          conversation.lastUpdated
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={`/calls/${conversation.id}`}
                          className="text-sm font-medium text-gray-900 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500">
              ◌
            </div>

            <h3 className="text-sm font-semibold text-gray-900">
              No conversations found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}