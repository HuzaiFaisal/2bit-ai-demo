// import { DataNotice, DataTable, PageHeading } from "@/components/dashboard";
// import { records } from "@/lib/data";

// export default async function Customers() {
//   const { data, error } = await records("customers");
//   const columns = [
//     { label: "Name", key: "first_name", cell: "name" as const, hrefPrefix: "/customers/" },
//     { label: "Phone", key: "phone" },
//     { label: "Email", key: "email" },
//     { label: "Language", key: "language" },
//     { label: "Created", key: "created_at", cell: "date" as const },
//   ];
//   return <><PageHeading eyebrow="WORKSPACE / DIRECTORY" title="Customers" description="Customer profiles from your connected workspace." />
//     <section className="panel card"><DataTable columns={columns} rows={data} searchKeys={["first_name", "last_name", "phone", "email", "language"]} empty="No customers found." /></section>
//     {error && <DataNotice error={error} />}
//     {!error && data.length === 0 && <DataNotice error="The customers query returned no rows for this session. If customer records exist, check the customers table SELECT policy for the Supabase role used by this dashboard." />}
//   </>;
// }


"use client";

import { useEffect, useState } from "react";
import { DataNotice, DataTable, PageHeading } from "@/components/dashboard";
import { createClient } from "@supabase/supabase-js";

export default function Customers() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );

      const { data: customers, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setData(customers || []);
      }
      setLoading(false);
    }
    fetchCustomers();
  }, []);

  const columns = [
    { label: "Name", key: "first_name", cell: "name" as const, hrefPrefix: "/customers/" },
    { label: "Phone", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Language", key: "language" },
    { label: "Created", key: "created_at", cell: "date" as const },
  ];

  return (
    <>
      <PageHeading eyebrow="WORKSPACE / DIRECTORY" title="Customers" description="Customer profiles from your connected workspace." />
      <section className="panel card">
        {loading ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#666" }}>Loading live customers...</div>
        ) : (
          <DataTable columns={columns} rows={data} searchKeys={["first_name", "last_name", "phone", "email", "language"]} empty="No customers found." />
        )}
      </section>
      {error && <DataNotice error={error} />}
      {!error && !loading && data.length === 0 && <DataNotice error="The customers query returned no rows for this session." />}
    </>
  );
}




