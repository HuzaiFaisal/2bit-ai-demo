// import { DataNotice, DataTable, PageHeading } from "@/components/dashboard";
// import { recordsWithCustomers } from "@/lib/data";

// export default async function Conversations() {
//   const { data, error, customerError, unresolvedCustomers } = await recordsWithCustomers("conversations");
//   const columns = [
//     { label: "Customer", key: "customer", cell: "customer" as const },
//     { label: "Channel", key: "channel", cell: "channel" as const },
//     { label: "Status", key: "status", cell: "status" as const },
//     { label: "Assigned to", key: "assigned_to" },
//     { label: "Created", key: "created_at", cell: "date" as const },
//     { label: "Updated", key: "updated_at", cell: "date" as const },
//   ];
//   return <><PageHeading eyebrow="WORKSPACE / INBOX" title="Conversations" description="Manage conversation status across voice, WhatsApp and web." />
//     <section className="panel card"><DataTable columns={columns} rows={data} searchKeys={["channel", "status", "assigned_to", "customers.phone", "customers.first_name", "customers.last_name"]} filters={[{ key: "channel", label: "channel", options: ["voice", "whatsapp", "web"] }, { key: "status", label: "status", options: ["open", "closed", "waiting_human"] }]} empty="No conversations found." /></section>
//     <div className="notice"><span>i</span><div><b>Conversation overview</b><p>This workspace does not include a message history table. Messages are not displayed here.</p></div></div>
//     {error && <DataNotice error={error} />}
//     {customerError && <DataNotice error={`Customer lookup query failed: ${customerError}`} />}
//     {!customerError && unresolvedCustomers > 0 && <DataNotice error={`${unresolvedCustomers} conversation row(s) reference customers that were not returned by the customers lookup. Check that customer_id values exist in customers.id and that the current Supabase role has SELECT access under RLS.`} />}
//   </>;
// }


"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DataNotice, DataTable, PageHeading } from "@/components/dashboard";
import { createClient } from "@supabase/supabase-js";

export default function Conversations() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConversations() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );

      const { data: conversations, error } = await supabase
        .from("conversations")
        .select("*, customers(id, first_name, last_name, phone)")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setData(conversations || []);
      }
      setLoading(false);
    }
    fetchConversations();
  }, []);

  const columns = [
    { label: "Customer", key: "customer", cell: "customer" as const },
    { label: "Channel", key: "channel", cell: "channel" as const },
    { label: "Status", key: "status", cell: "status" as const },
    { label: "Assigned to", key: "assigned_to" },
    { label: "Created", key: "created_at", cell: "date" as const },
    { label: "Updated", key: "updated_at", cell: "date" as const },
  ];

  return (
    <>
      <PageHeading eyebrow="WORKSPACE / INBOX" title="Conversations" description="Manage conversation status across voice, WhatsApp and web." />
      <section className="panel card">
        {loading ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#666" }}>Loading live conversations...</div>
        ) : (
          <DataTable columns={columns} rows={data} searchKeys={["channel", "status", "assigned_to", "customers.phone", "customers.first_name", "customers.last_name"]} filters={[{ key: "channel", label: "channel", options: ["voice", "whatsapp", "web"] }, { key: "status", label: "status", options: ["open", "closed", "waiting_human"] }]} empty="No conversations found." />
        )}
      </section>
      <div className="notice"><span>i</span><div><b>Conversation overview</b><p>This workspace does not include a message history table. Messages are not displayed here.</p></div></div>
      {error && <DataNotice error={error} />}
    </>
  );
}