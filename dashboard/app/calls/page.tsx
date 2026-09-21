import CallsTable from "@/components/dashboard/CallsTable";
import { getDashboardData } from "@/lib/dashboardData";

export default async function CallsPage() {
  const data = await getDashboardData();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Calls
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          View and manage conversations handled by the AI agent.
        </p>
      </div>

      <CallsTable calls={data.calls} />
    </div>
  );
}