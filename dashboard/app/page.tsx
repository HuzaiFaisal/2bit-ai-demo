// export default function Home() {
//   return (
//     <main className="min-h-screen bg-gray-50 p-8">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-8">
//           <p className="text-sm font-medium text-gray-500">2BIT AI</p>

//           <h1 className="mt-1 text-3xl font-bold text-gray-900">
//             Customer & Sales Agent
//           </h1>

//           <p className="mt-2 text-gray-600">
//             AI-powered customer communication platform
//           </p>
//         </div>

//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//           <DashboardCard title="Calls" value="0" description="Total AI calls" />

//           <DashboardCard title="Leads" value="0" description="New leads" />

//           <DashboardCard
//             title="Appointments"
//             value="0"
//             description="Upcoming appointments"
//           />

//           <DashboardCard
//             title="AI Resolved"
//             value="0%"
//             description="Resolved without human"
//           />
//         </div>

//         <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
//           <h2 className="text-lg font-semibold text-gray-900">AI Agent</h2>

//           <div className="mt-4 flex items-center justify-between">
//             <div>
//               <p className="font-medium text-gray-900">Noura</p>

//               <p className="text-sm text-gray-500">
//                 2Bit Motors Saudi - AI Sales Assistant
//               </p>
//             </div>

//             <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
//               Active
//             </span>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

// function DashboardCard({
//   title,
//   value,
//   description,
// }: {
//   title: string;
//   value: string;
//   description: string;
// }) {
//   return (
//     <div className="rounded-xl border bg-white p-6 shadow-sm">
//       <p className="text-sm font-medium text-gray-500">{title}</p>

//       <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>

//       <p className="mt-1 text-sm text-gray-500">{description}</p>
//     </div>
//   );
// }


import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const [
    { count: callsCount, error: callsError },
    { count: leadsCount, error: leadsError },
    { count: appointmentsCount, error: appointmentsError },
    { count: completedCallsCount, error: completedCallsError },
    { count: humanCallsCount, error: humanCallsError },
  ] = await Promise.all([
    supabase
      .from("calls")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("leads")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "confirmed"]),

    supabase
      .from("calls")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),

    supabase
      .from("calls")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed")
      .eq("needs_human", true),
  ]);

  const errors = [
    callsError,
    leadsError,
    appointmentsError,
    completedCallsError,
    humanCallsError,
  ].filter(Boolean);

  if (errors.length > 0) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-red-600">
            Dashboard data error
          </h1>

          <pre className="mt-4 rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">
            {errors.map((error) => error?.message).join("\n")}
          </pre>
        </div>
      </main>
    );
  }

  const totalCalls = callsCount ?? 0;
  const totalLeads = leadsCount ?? 0;
  const totalAppointments = appointmentsCount ?? 0;
  const completedCalls = completedCallsCount ?? 0;
  const humanCalls = humanCallsCount ?? 0;

  const aiResolved =
    completedCalls > 0
      ? Math.round(((completedCalls - humanCalls) / completedCalls) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">2BIT AI</p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Customer & Sales Agent
          </h1>

          <p className="mt-2 text-gray-600">
            AI-powered customer communication platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Calls"
            value={String(totalCalls)}
            description="Total AI calls"
          />

          <DashboardCard
            title="Leads"
            value={String(totalLeads)}
            description="Total leads"
          />

          <DashboardCard
            title="Appointments"
            value={String(totalAppointments)}
            description="Upcoming appointments"
          />

          <DashboardCard
            title="AI Resolved"
            value={`${aiResolved}%`}
            description="Resolved without human"
          />
        </div>

        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">AI Agent</h2>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Noura</p>

              <p className="text-sm text-gray-500">
                2Bit Motors Saudi - AI Sales Assistant
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              Active
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>

      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}