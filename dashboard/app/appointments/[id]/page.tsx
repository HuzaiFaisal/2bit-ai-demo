import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/dashboard/StatusBadge";

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "—";
  }

  return new Date(`${dateString}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
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

export default async function AppointmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: appointment, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !appointment) {
    return (
      <div>
        <Link
          href="/appointments"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Appointments
        </Link>

        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">
            Appointment not found
          </h2>

          <p className="mt-1 text-sm text-red-700">
            The requested appointment could not be found.
          </p>
        </div>
      </div>
    );
  }

  let customer = null;

  if (appointment.customer_id) {
    const { data: customerData } = await supabase
      .from("customers")
      .select("id, name, mobile")
      .eq("id", appointment.customer_id)
      .single();

    customer = customerData;
  }

  return (
    <div>
      <Link
        href="/appointments"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back to Appointments
      </Link>

      <div className="mb-8 mt-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Appointment Details
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          View the details of this scheduled appointment.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer */}
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
                {customer?.mobile || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Appointment Status */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">
            Appointment Status
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500">
                Status
              </p>

              <div className="mt-2">
                <StatusBadge
                  status={appointment.status}
                />
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Appointment Type
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatAppointmentType(
                  appointment.appointment_type
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">
            Schedule
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500">
                Date
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(
                  appointment.appointment_date
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Time
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatTime(
                  appointment.appointment_time
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Vehicle */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">
            Vehicle
          </h3>

          <div className="mt-5">
            <p className="text-xs text-gray-500">
              Selected Vehicle
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              {appointment.vehicle || "No vehicle specified"}
            </p>
          </div>
        </section>
      </div>

      {/* IDs */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">
          Appointment Information
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">
              Appointment ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-gray-600">
              {appointment.id}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Lead ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-gray-600">
              {appointment.lead_id || "—"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}