import { createClient } from "../../lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  const { data: agents, error } = await supabase
    .from("agents")
    .select("*");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">
          Supabase Test
        </h1>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">
            Agents from Supabase
          </h2>

          <pre className="mt-4 overflow-auto rounded bg-gray-100 p-4">
            {JSON.stringify({ agents, error }, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}