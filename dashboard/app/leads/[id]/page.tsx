import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/dashboard/StatusBadge";

function formatBudget(budget: number | null) {
  if (!budget) return "Not specified";

  return `SAR ${budget.toLocaleString()}`;
}

export default async function LeadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !lead) {
    return (
      <div>
        <Link
          href="/leads"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Leads
        </Link>

        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">
            Lead not found
          </h2>

          <p className="mt-1 text-sm text-red-700">
            The requested lead could not be found.
          </p>
        </div>
      </div>
    );
  }

  let customer = null;

  if (lead.customer_id) {
    const { data: customerData } = await supabase
      .from("customers")
      .select("id, name, mobile")
      .eq("id", lead.customer_id)
      .single();

    customer = customerData;
  }

  return (
    <div>
      {/* Back */}
      <Link
        href="/leads"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back to Leads
      </Link>

      {/* Header */}
      <div className="mb-8 mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Lead Details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View customer opportunity and lead information.
          </p>
        </div>

        <StatusBadge status={lead.status} />
      </div>

      {/* Main Information */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">
            Customer
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500">
                Customer Name
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

        {/* Lead Status */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">
            Lead Status
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500">
                Current Status
              </p>

              <div className="mt-2">
                <StatusBadge status={lead.status} />
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Source
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {lead.source || "Unknown"}
              </p>
            </div>
          </div>
        </section>

        {/* Vehicle Interest */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">
            Vehicle Interest
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500">
                Interest
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {lead.interest || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Preferred Vehicle
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {lead.preferred_vehicle || "Not specified"}
              </p>
            </div>
          </div>
        </section>

        {/* Purchase Information */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">
            Purchase Information
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500">
                Budget
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {formatBudget(lead.budget)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Purchase Timeline
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {lead.purchase_timeline || "Not specified"}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Notes */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">
          Notes
        </h3>

        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="text-sm leading-6 text-gray-700">
            {lead.notes || "No notes available."}
          </p>
        </div>
      </section>

      {/* Lead Information */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">
          Lead Information
        </h3>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">
              Lead ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-gray-600">
              {lead.id}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Customer ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-gray-600">
              {lead.customer_id || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Created At
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {lead.created_at
                ? new Date(
                    lead.created_at
                  ).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "—"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}