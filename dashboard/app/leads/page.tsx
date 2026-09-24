import LeadsTable from "@/components/dashboard/LeadsTable";
import { getDashboardData } from "@/lib/dashboardData";

export default async function LeadsPage() {
  const data = await getDashboardData();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Leads
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          View and manage customer opportunities captured by
          the AI sales assistant.
        </p>
      </div>

      <LeadsTable leads={data.leads} />
    </div>
  );
}