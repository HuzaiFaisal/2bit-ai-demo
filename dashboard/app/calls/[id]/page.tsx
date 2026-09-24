import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/dashboard/StatusBadge";

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

export default async function CallDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: call, error } = await supabase
    .from("calls")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !call) {
    return (
      <div>
        <Link
          href="/calls"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Calls
        </Link>

        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">
            Call not found
          </h2>

          <p className="mt-1 text-sm text-red-700">
            The requested call could not be found.
          </p>
        </div>
      </div>
    );
  }

  let customer = null;

  if (call.customer_id) {
    const { data: customerData } = await supabase
      .from("customers")
      .select("id, name, mobile")
      .eq("id", call.customer_id)
      .single();

    customer = customerData;
  }

  return (
    <div>
      <Link
        href="/calls"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back to Calls
      </Link>

      <div className="mb-8 mt-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Call Details
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Detailed information about this AI conversation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">
            Customer
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500">
                Name
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {customer?.name || "Unknown customer"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Phone
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {call.customer_phone || customer?.mobile || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Call Date
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDateTime(call.created_at)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">
            Call Status
          </h3>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">
                Status
              </p>

              <div className="mt-2">
                <StatusBadge status={call.status} />
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Lead Quality
              </p>

              <div className="mt-2">
                <StatusBadge status={call.lead_quality} />
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Duration
              </p>

              <p className="mt-2 text-sm font-medium text-gray-900">
                {formatDuration(call.duration_seconds)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                AI Resolution
              </p>

              <p className="mt-2 text-sm font-medium text-gray-900">
                {call.needs_human
                  ? "Human Handoff"
                  : "AI Resolved"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">
            Customer Interest
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500">
                Intent
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {call.customer_intent || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Vehicle
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {call.vehicle_interest || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Budget
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {call.budget
                  ? `SAR ${call.budget.toLocaleString()}`
                  : "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Appointment Requested
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {call.appointment_requested ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">
            AI Summary
          </h3>

          <p className="mt-5 text-sm leading-6 text-gray-600">
            {call.summary || "No summary available."}
          </p>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">
          Transcript
        </h3>

        <div className="mt-5 rounded-lg bg-gray-50 p-5">
          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
            {call.transcript || "No transcript available for this call."}
          </p>
        </div>
      </section>
    </div>
  );
}