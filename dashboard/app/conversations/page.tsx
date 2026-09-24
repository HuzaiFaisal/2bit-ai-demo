import { DataNotice, DataTable, PageHeading } from "@/components/dashboard";
import { recordsWithCustomers } from "@/lib/data";

export default async function Conversations() {
  const { data, error, customerError, unresolvedCustomers } = await recordsWithCustomers("conversations");
  const columns = [
    { label: "Customer", key: "customer", cell: "customer" as const },
    { label: "Channel", key: "channel", cell: "channel" as const },
    { label: "Status", key: "status", cell: "status" as const },
    { label: "Assigned to", key: "assigned_to" },
    { label: "Created", key: "created_at", cell: "date" as const },
    { label: "Updated", key: "updated_at", cell: "date" as const },
  ];
  return <><PageHeading eyebrow="WORKSPACE / INBOX" title="Conversations" description="Manage conversation status across voice, WhatsApp and web." />
    <section className="panel card"><DataTable columns={columns} rows={data} searchKeys={["channel", "status", "assigned_to", "customers.phone", "customers.first_name", "customers.last_name"]} filters={[{ key: "channel", label: "channel", options: ["voice", "whatsapp", "web"] }, { key: "status", label: "status", options: ["open", "closed", "waiting_human"] }]} empty="No conversations found." /></section>
    <div className="notice"><span>i</span><div><b>Conversation overview</b><p>This workspace does not include a message history table. Messages are not displayed here.</p></div></div>
    {error && <DataNotice error={error} />}
    {customerError && <DataNotice error={`Customer lookup query failed: ${customerError}`} />}
    {!customerError && unresolvedCustomers > 0 && <DataNotice error={`${unresolvedCustomers} conversation row(s) reference customers that were not returned by the customers lookup. Check that customer_id values exist in customers.id and that the current Supabase role has SELECT access under RLS.`} />}
  </>;
}
