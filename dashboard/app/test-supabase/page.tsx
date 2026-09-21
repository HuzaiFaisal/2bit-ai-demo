import { createClient } from "@/lib/supabase/server";

export default async function TestSupabasePage() {
  const supabase = await createClient();

  const calls = await supabase
    .from("calls")
    .select("*")
    .limit(5);

  const leads = await supabase
    .from("leads")
    .select("*")
    .limit(5);

  const appointments = await supabase
    .from("appointments")
    .select("*")
    .limit(5);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-8 text-2xl font-bold">
        Supabase Data Test
      </h1>

      <section className="mb-8 rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Calls
        </h2>

        <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-xs">
          {JSON.stringify(calls, null, 2)}
        </pre>
      </section>

      <section className="mb-8 rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Leads
        </h2>

        <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-xs">
          {JSON.stringify(leads, null, 2)}
        </pre>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Appointments
        </h2>

        <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-xs">
          {JSON.stringify(appointments, null, 2)}
        </pre>
      </section>
    </main>
  );
}