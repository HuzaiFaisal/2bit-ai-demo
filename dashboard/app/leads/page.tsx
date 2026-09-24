/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataNotice, DataTable, PageHeading } from "@/components/dashboard";
import { recordsWithCustomers } from "@/lib/data";

export default async function Leads() {
  const { data, error, customerError, unresolvedCustomers } = await recordsWithCustomers("leads");
  const columns = [
    { label: "Customer", key: "customer", cell: "customer" as const },
    { label: "Phone", key: "customers.phone" },
    { label: "Status", key: "status", cell: "status" as const },
    { label: "Interest", key: "interest" },
    { label: "Preferred vehicle", key: "preferred_vehicle" },
    { label: "Budget", key: "budget" },
    { label: "Purchase timeline", key: "purchase_timeline" },
    { label: "Source", key: "source" },
    { label: "Notes", key: "notes" },
    { label: "Created", key: "created_at", cell: "date" as const },
  ];
  const vehicles = [...new Set(data.map((r: any) => r.preferred_vehicle).filter(Boolean))] as string[];
  return <><PageHeading eyebrow="WORKSPACE / SALES" title="Leads" description="Track customer interest and sales progress." />
    <section className="panel card"><DataTable columns={columns} rows={data} searchKeys={["source", "status", "interest", "preferred_vehicle", "purchase_timeline", "budget", "notes", "customers.phone", "customers.first_name", "customers.last_name"]} filters={[{ key: "status", label: "status", options: ["new", "contacted", "qualified", "won", "lost"] }, { key: "preferred_vehicle", label: "vehicle", options: vehicles }]} empty="No leads found." /></section>
    {error && <DataNotice error={error} />}
    {customerError && <DataNotice error={`Customer lookup query failed: ${customerError}`} />}
    {!customerError && unresolvedCustomers > 0 && <DataNotice error={`${unresolvedCustomers} lead row(s) reference customers that were not returned by the customers lookup. Check that customer_id values exist in customers.id and that the current Supabase role has SELECT access under RLS.`} />}
  </>;
}
