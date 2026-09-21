import StatCard from "@/components/dashboard/StatCard";
import SectionHeader from "@/components/dashboard/SectionHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import EmptyState from "@/components/dashboard/EmptyState";
import { getDashboardData } from "@/lib/dashboardData";

function formatDuration(seconds: number | null) {
  if (!seconds) {
    return "—";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "—";
  }

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Overview
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Monitor your AI customer and sales activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Calls"
          value={data.stats.calls}
          description="Total AI calls"
          icon="☎"
        />

        <StatCard
          title="Leads"
          value={data.stats.leads}
          description="Total leads"
          icon="◉"
        />

        <StatCard
          title="Appointments"
          value={data.stats.appointments}
          description="Total appointments"
          icon="▣"
        />

        <StatCard
          title="AI Resolved"
          value={`${data.stats.aiResolved}%`}
          description="Resolved without human"
          icon="✦"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section>
          <SectionHeader
            title="Recent Calls"
            description="Latest conversations handled by Noura."
          />

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {data.calls.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.calls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between gap-4 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {call.customer?.name || call.customer_phone}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {call.vehicle_interest || "No vehicle"} ·{" "}
                        {call.customer_intent || "No intent"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDuration(call.duration_seconds)} ·{" "}
                        {formatDate(call.created_at)}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <StatusBadge status={call.lead_quality} />

                      <StatusBadge status={call.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No calls yet"
                description="AI calls handled by Noura will appear here."
                icon="☎"
              />
            )}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Recent Leads"
            description="Latest customer opportunities."
          />

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {data.leads.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between gap-4 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {lead.customer?.name || "Unknown customer"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {lead.preferred_vehicle || "No vehicle"} ·{" "}
                        {lead.interest || "No interest"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Budget:{" "}
                        {lead.budget
                          ? `SAR ${lead.budget.toLocaleString()}`
                          : "Not specified"}
                      </p>
                    </div>

                    <StatusBadge status={lead.status} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No leads yet"
                description="Leads created through customer conversations will appear here."
                icon="◉"
              />
            )}
          </div>
        </section>
      </div>

      <section className="mt-8">
        <SectionHeader
          title="Upcoming Appointments"
          description="Scheduled customer appointments."
        />

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {data.appointments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {appointment.customer?.name || "Unknown customer"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {appointment.vehicle || "No vehicle"} ·{" "}
                      {appointment.appointment_type.replace("_", " ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(appointment.appointment_date)}
                      </p>

                      <p className="text-xs text-gray-500">
                        {formatTime(appointment.appointment_time)}
                      </p>
                    </div>

                    <StatusBadge status={appointment.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming appointments"
              description="Scheduled appointments will appear here."
              icon="▣"
            />
          )}
        </div>
      </section>
    </div>
  );
}