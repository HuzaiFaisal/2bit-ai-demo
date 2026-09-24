import ConversationsTable from "@/components/dashboard/ConversationsTable";
import { getDashboardData } from "@/lib/dashboardData";

export default async function ConversationsPage() {
  const data = await getDashboardData();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Conversations
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          View customer conversations handled across supported channels.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Conversation channels
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Voice conversations are currently available through
              the AI calling system. Additional channels such as
              WhatsApp and web chat can be connected later.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Voice Active
            </span>

            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
              WhatsApp Not Connected
            </span>

            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
              Web Chat Not Connected
            </span>
          </div>
        </div>
      </div>

      <ConversationsTable calls={data.calls} />
    </div>
  );
}