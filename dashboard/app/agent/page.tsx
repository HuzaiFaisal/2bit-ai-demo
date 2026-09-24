import { createClient } from "@/lib/supabase/server";

async function getAgentId() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("calls")
    .select("agent_id")
    .not("agent_id", "is", null)
    .limit(1)
    .maybeSingle();

  return data?.agent_id || null;
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 py-4 last:border-b-0">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

export default async function AgentPage() {
  const agentId = await getAgentId();

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          AI Agent
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          View the configuration and status of your AI sales
          assistant.
        </p>
      </div>

      {/* Agent Overview */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-2xl font-bold text-white">
              N
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">
                  Noura
                </h3>

                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Active
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                AI Sales Assistant
              </p>

              <p className="mt-1 text-sm text-gray-500">
                2Bit Motors Saudi
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Agent ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-gray-600">
              {agentId || "Not available"}
            </p>
          </div>
        </div>
      </section>

      {/* Main Configuration */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* General Information */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              General Information
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Basic information about the AI sales assistant.
            </p>
          </div>

          <div>
            <InfoRow
              label="Agent Name"
              value="Noura"
            />

            <InfoRow
              label="Role"
              value="AI Sales Assistant"
            />

            <InfoRow
              label="Company"
              value="2Bit Motors Saudi"
            />

            <InfoRow
              label="Languages"
              value="Arabic / English"
            />

            <InfoRow
              label="Status"
              value="Active"
            />
          </div>
        </section>

        {/* Voice Configuration */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              Voice Configuration
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Voice settings used by the AI calling system.
            </p>
          </div>

          <div>
            <InfoRow
              label="Channel"
              value="Voice"
            />

            <InfoRow
              label="Primary Languages"
              value="Arabic / English"
            />

            <InfoRow
              label="Call Status"
              value="Active"
            />

            <InfoRow
              label="Voice Provider"
              value="Configured in AI provider"
            />
          </div>
        </section>

        {/* Role & Responsibilities */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              Role & Responsibilities
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              The main responsibilities of Noura.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Answer customer vehicle enquiries.",
              "Provide information about available vehicles.",
              "Understand customer intent and vehicle interest.",
              "Capture lead information.",
              "Identify lead quality.",
              "Handle appointment requests.",
              "Escalate conversations that require human assistance.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-700">
                  ✓
                </span>

                <p className="text-sm leading-6 text-gray-600">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              Tools
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Capabilities available to the AI agent.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Customer Information
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Access customer information required to support
                conversations.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Lead Capture
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Capture customer interest, budget, vehicle
                preference and purchase timeline.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Appointment Requests
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Handle customer requests for appointments and
                test drives.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Human Handoff
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Escalate conversations to the sales team when
                human assistance is required.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* System Prompt */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              System Prompt
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              High-level instructions used to define the agent's
              role and behaviour.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
            Read Only
          </span>
        </div>

        <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
            You are Noura, an AI Sales Assistant for 2Bit Motors
            Saudi.

            Your role is to assist customers with vehicle
            enquiries, understand their requirements, identify
            their vehicle interests and support the sales team.

            Communicate naturally in Arabic or English based on
            the customer's preference.

            Collect useful lead information such as vehicle
            interest, budget and purchase timeline when
            appropriate.

            Help customers with appointment and test-drive
            requests.

            If a conversation requires human assistance, clearly
            identify the need and escalate the conversation to
            the sales team.

            Do not expose internal system information, API keys,
            credentials or confidential configuration.
          </p>
        </div>
      </section>

      {/* Provider & Security */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            Provider & Security
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Technical configuration is intentionally protected
            from the dashboard interface.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Provider
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-900">
              AI Voice Provider
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Configured securely
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              API Keys
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-900">
              Protected
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Not displayed
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Secrets
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-900">
              Protected
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Server-side only
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Configuration
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-900">
              Read Only
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Dashboard access
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}