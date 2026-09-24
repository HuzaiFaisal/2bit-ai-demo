"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface AppointmentsTableProps {
  appointments: any[];
}

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "—";
  }

  return new Date(`${dateString}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function formatTime(timeString: string | null) {
  if (!timeString) {
    return "—";
  }

  const [hours, minutes] = timeString.split(":");

  const date = new Date();

  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatAppointmentType(type: string | null) {
  if (!type) {
    return "—";
  }

  return type
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export default function AppointmentsTable({
  appointments,
}: AppointmentsTableProps) {
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "all" | "confirmed" | "pending" | "cancelled"
  >("all");

  const filteredAppointments = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return appointments.filter((appointment) => {
      const customerName =
        appointment.customer?.name?.toLowerCase() || "";

      const phone =
        appointment.customer?.mobile?.toLowerCase() || "";

      const vehicle =
        appointment.vehicle?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        customerName.includes(searchValue) ||
        phone.includes(searchValue) ||
        vehicle.includes(searchValue);

      const matchesFilter =
        filter === "all"
          ? true
          : appointment.status?.toLowerCase() === filter;

      return matchesSearch && matchesFilter;
    });
  }, [appointments, search, filter]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              All Appointments
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {filteredAppointments.length} appointment
              {filteredAppointments.length === 1
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
            placeholder="Search customer, phone or vehicle..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 sm:w-96"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            {
              label: "All",
              value: "all",
            },
            {
              label: "Confirmed",
              value: "confirmed",
            },
            {
              label: "Pending",
              value: "pending",
            },
            {
              label: "Cancelled",
              value: "cancelled",
            },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setFilter(
                  item.value as
                    | "all"
                    | "confirmed"
                    | "pending"
                    | "cancelled"
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

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Customer
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Vehicle
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Appointment Type
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Time
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.map(
                  (appointment) => (
                    <tr
                      key={appointment.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={`/appointments/${appointment.id}`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          {appointment.customer?.name ||
                            "Unknown customer"}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {appointment.customer?.mobile ||
                          "—"}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-gray-700">
                        {appointment.vehicle || "—"}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatAppointmentType(
                          appointment.appointment_type
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDate(
                          appointment.appointment_date
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-gray-700">
                        {formatTime(
                          appointment.appointment_time
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge
                          status={appointment.status}
                        />
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
              ▣
            </div>

            <h3 className="text-sm font-semibold text-gray-900">
              No appointments found
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