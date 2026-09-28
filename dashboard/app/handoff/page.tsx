// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { DataNotice, DataTable, PageHeading } from "@/components/dashboard";
// import { recordsWithCustomers } from "@/lib/data";

// export default async function Handoff() {
//   const { data, error, customerError, unresolvedCustomers } = await recordsWithCustomers("tool_calls");
//   const rows = data.filter((row: any) => row.tool_name === "human_handoff");
//   const columns = [
//     { label: "Customer", key: "customer", cell: "customer" as const },
//     { label: "Reason", key: "reason", cell: "reason" as const },
//     { label: "Call ID", key: "call_id", cell: "call-link" as const },
//     { label: "Status", key: "status", cell: "status" as const },
//     { label: "Succeeded", key: "succeeded", cell: "success" as const },
//     { label: "Created", key: "created_at", cell: "date" as const },
//   ];
//   return <><PageHeading eyebrow="WORKSPACE / ESCALATIONS" title="Human Assistance Requested" description="Requests recorded by the AI system for team follow-up." />
//     <section className="panel card"><DataTable columns={columns} rows={rows} searchKeys={["status", "input.reason", "input.message", "customers.phone", "customers.first_name", "customers.last_name"]} empty="No human assistance requests recorded." /></section>
//     <div className="notice"><span>i</span><div><b>Request logged</b><p>A human_handoff event records an assistance request; it does not confirm that a live transfer was completed.</p></div></div>
//     {error && <DataNotice error={error} />}
//     {customerError && <DataNotice error={`Customer lookup query failed: ${customerError}`} />}
//     {!customerError && unresolvedCustomers > 0 && <DataNotice error={`${unresolvedCustomers} tool event row(s) reference customers that were not returned by the customers lookup. Check that customer_id values exist in customers.id and that the current Supabase role has SELECT access under RLS.`} />}
//   </>;
// }



"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DataNotice, DataTable, PageHeading } from "@/components/dashboard";
import { createClient } from "@supabase/supabase-js";

export default function Handoff() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHandoffs() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );

      const { data: toolCalls, error } = await supabase
        .from("tool_calls")
        .select("*, customers(id, first_name, last_name, phone)")
        .eq("tool_name", "human_handoff")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setRows(toolCalls || []);
      }
      setLoading(false);
    }
    fetchHandoffs();
  }, []);

  const columns = [
    { label: "Customer", key: "customer", cell: "customer" as const },
    { label: "Reason", key: "reason", cell: "reason" as const },
    { label: "Call ID", key: "call_id", cell: "call-link" as const },
    { label: "Status", key: "status", cell: "status" as const },
    { label: "Succeeded", key: "succeeded", cell: "success" as const },
    { label: "Created", key: "created_at", cell: "date" as const },
  ];

  return (
    <>
      <PageHeading eyebrow="WORKSPACE / ESCALATIONS" title="Human Assistance Requested" description="Requests recorded by the AI system for team follow-up." />
      <section className="panel card">
        {loading ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#666" }}>Loading live handoffs...</div>
        ) : (
          <DataTable columns={columns} rows={rows} searchKeys={["status", "input.reason", "input.message", "customers.phone", "customers.first_name", "customers.last_name"]} empty="No human assistance requests recorded." />
        )}
      </section>
      <div className="notice"><span>i</span><div><b>Request logged</b><p>A human_handoff event records an assistance request; it does not confirm that a live transfer was completed.</p></div></div>
      {error && <DataNotice error={error} />}
    </>
  );
}