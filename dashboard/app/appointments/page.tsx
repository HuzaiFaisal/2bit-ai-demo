/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataNotice, DataTable, PageHeading } from "@/components/dashboard";
import { recordsWithCustomers } from "@/lib/data";

export default async function Appointments() {
  const { data, error, customerError, unresolvedCustomers } = await recordsWithCustomers("appointments");
  const dates = [...new Set(data.map((r: any) => r.appointment_date).filter(Boolean))] as string[];
  const columns = [
    { label: "Customer", key: "customer", cell: "customer" as const },
    { label: "Vehicle", key: "vehicle" },
    { label: "Appointment date", key: "appointment_date" },
    { label: "Appointment time", key: "appointment_time" },
    { label: "Appointment type", key: "appointment_type" },
    { label: "Status", key: "status", cell: "status" as const },
    { label: "Created", key: "created_at", cell: "date" as const },
  ];
  return <><PageHeading eyebrow="WORKSPACE / SCHEDULING" title="Appointments" description="Review scheduled customer appointments." />
    <section className="panel card"><DataTable columns={columns} rows={data} searchKeys={["vehicle", "appointment_type", "appointment_date", "appointment_time", "status", "customers.phone", "customers.first_name", "customers.last_name"]} filters={[{ key: "status", label: "status", options: ["pending", "confirmed", "completed", "cancelled"] }, { key: "appointment_date", label: "date", options: dates }]} empty="No appointments found." /></section>
    {error && <DataNotice error={error} />}
    {customerError && <DataNotice error={`Customer lookup query failed: ${customerError}`} />}
    {!customerError && unresolvedCustomers > 0 && <DataNotice error={`${unresolvedCustomers} appointment row(s) reference customers that were not returned by the customers lookup. Check that customer_id values exist in customers.id and that the current Supabase role has SELECT access under RLS.`} />}
  </>;
}
