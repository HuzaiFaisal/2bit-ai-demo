/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataNotice, DataTable, PageHeading } from "@/components/dashboard";
import { recordsWithCustomers } from "@/lib/data";

export default async function Calls() {
  const { data, error, customerError, unresolvedCustomers } = await recordsWithCustomers("calls");
  const columns = [
    { label: "Customer", key: "customer", cell: "customer" as const },
    { label: "Phone", key: "customer_phone", fallbackKey: "customers.phone" },
    { label: "Created", key: "created_at", cell: "date" as const },
    { label: "Duration", key: "duration_seconds", cell: "duration" as const },
    { label: "Vehicle interest", key: "vehicle_interest" },
    { label: "Customer intent", key: "customer_intent" },
    { label: "Lead quality", key: "lead_quality" },
    { label: "Appointment requested", key: "appointment_requested", cell: "boolean" as const },
    { label: "Appointment booked", key: "appointment_booked", cell: "boolean" as const },
    { label: "Human assistance", key: "needs_human", cell: "human" as const },
    { label: "Status", key: "status", cell: "status" as const },
  ];
  return <><PageHeading eyebrow="WORKSPACE / CALLS" title="Calls" description="Recorded AI calls and their outcomes. Select a row to view its details." />
    <section className="panel card"><DataTable columns={columns} rows={data} rowHrefPrefix="/calls/" searchKeys={["customer_phone", "vehicle_interest", "customer_intent", "status", "lead_quality", "customers.first_name", "customers.last_name"]} filters={[{ key: "status", label: "status", options: [...new Set(data.map((r: any) => r.status).filter(Boolean))] as string[] }, { key: "lead_quality", label: "lead quality", options: [...new Set(data.map((r: any) => r.lead_quality).filter(Boolean))] as string[] }]} empty="No calls found." /></section>
    {error && <DataNotice error={error} />}
    {customerError && <DataNotice error={`Customer lookup query failed: ${customerError}`} />}
    {!customerError && unresolvedCustomers > 0 && <DataNotice error={`${unresolvedCustomers} call row(s) reference customers that were not returned by the customers lookup. Check that customer_id values exist in customers.id and that the current Supabase role has SELECT access under RLS.`} />}
  </>;
}
