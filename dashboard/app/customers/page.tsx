import { DataNotice, DataTable, PageHeading } from "@/components/dashboard";
import { records } from "@/lib/data";

export default async function Customers() {
  const { data, error } = await records("customers");
  const columns = [
    { label: "Name", key: "first_name", cell: "name" as const, hrefPrefix: "/customers/" },
    { label: "Phone", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Language", key: "language" },
    { label: "Created", key: "created_at", cell: "date" as const },
  ];
  return <><PageHeading eyebrow="WORKSPACE / DIRECTORY" title="Customers" description="Customer profiles from your connected workspace." />
    <section className="panel card"><DataTable columns={columns} rows={data} searchKeys={["first_name", "last_name", "phone", "email", "language"]} empty="No customers found." /></section>
    {error && <DataNotice error={error} />}
    {!error && data.length === 0 && <DataNotice error="The customers query returned no rows for this session. If customer records exist, check the customers table SELECT policy for the Supabase role used by this dashboard." />}
  </>;
}
