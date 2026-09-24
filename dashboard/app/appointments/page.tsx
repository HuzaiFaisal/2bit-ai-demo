import AppointmentsTable from "@/components/dashboard/AppointmentsTable";
import { getDashboardData } from "@/lib/dashboardData";

export default async function AppointmentsPage() {
  const data = await getDashboardData();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Appointments
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          View and manage scheduled customer appointments.
        </p>
      </div>

      <AppointmentsTable appointments={data.appointments} />
    </div>
  );
}