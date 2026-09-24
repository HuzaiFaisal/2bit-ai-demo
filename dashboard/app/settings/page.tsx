function SettingRow({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-xs leading-5 text-gray-500">
            {description}
          </p>
        )}
      </div>

      <div className="sm:text-right">
        <p className="text-sm font-medium text-gray-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
}: {
  title: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-4 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>

      <div
        className={`relative h-6 w-11 shrink-0 rounded-full ${
          enabled ? "bg-gray-900" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Settings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage your workspace and dashboard configuration.
        </p>
      </div>

      {/* Workspace Settings */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            Workspace
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            General information about this AI customer and sales
            workspace.
          </p>
        </div>

        <div>
          <SettingRow
            label="Workspace Name"
            value="2Bit Motors Saudi"
            description="The company workspace connected to the dashboard."
          />

          <SettingRow
            label="Platform"
            value="2BIT AI"
            description="AI-powered customer and sales platform."
          />

          <SettingRow
            label="Workspace Type"
            value="Automotive Sales"
            description="Primary business category."
          />

          <SettingRow
            label="Currency"
            value="SAR"
            description="Default currency used for customer budgets."
          />

          <SettingRow
            label="Time Zone"
            value="Asia/Riyadh"
            description="Default business time zone."
          />
        </div>
      </section>

      {/* AI Agent Settings */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              AI Agent
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Configuration related to the AI sales assistant.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Active
          </span>
        </div>

        <div>
          <SettingRow
            label="Agent Name"
            value="Noura"
            description="Name displayed for the AI sales assistant."
          />

          <SettingRow
            label="Role"
            value="AI Sales Assistant"
            description="Primary role of the agent."
          />

          <SettingRow
            label="Languages"
            value="Arabic / English"
            description="Languages supported by the current agent."
          />

          <SettingRow
            label="Primary Channel"
            value="Voice"
            description="Current customer communication channel."
          />

          <SettingRow
            label="Configuration"
            value="Read Only"
            description="Agent configuration is managed securely outside this dashboard."
          />
        </div>
      </section>

      {/* Notifications */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            Notifications
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Dashboard notification preferences.
          </p>
        </div>

        <div>
          <ToggleRow
            title="Human Handoff Alerts"
            description="Show alerts when an AI conversation requires human assistance."
            enabled={true}
          />

          <ToggleRow
            title="New Lead Alerts"
            description="Show notifications when a new lead is created."
            enabled={true}
          />

          <ToggleRow
            title="Appointment Alerts"
            description="Show notifications for newly scheduled appointments."
            enabled={true}
          />

          <ToggleRow
            title="System Notifications"
            description="Show important dashboard and system notifications."
            enabled={true}
          />
        </div>
      </section>

      {/* Security */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            Security
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Sensitive technical configuration is protected from
            the dashboard interface.
          </p>
        </div>

        <div>
          <SettingRow
            label="API Keys"
            value="Protected"
            description="Provider API keys are not displayed in the dashboard."
          />

          <SettingRow
            label="Database Credentials"
            value="Protected"
            description="Database credentials are handled securely on the server."
          />

          <SettingRow
            label="Service Credentials"
            value="Protected"
            description="Server-side credentials are not exposed to dashboard users."
          />

          <SettingRow
            label="Environment Variables"
            value="Server-side"
            description="Private environment variables are not shown here."
          />
        </div>
      </section>

      {/* Connected Services */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            Connected Services
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Services currently represented in the dashboard.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Supabase
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Database and application data storage.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Connected
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  AI Voice System
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Voice conversations handled by the AI agent.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Connected
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  WhatsApp
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Customer messaging channel.
                </p>
              </div>

              <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                Not Connected
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Web Chat
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Website customer chat channel.
                </p>
              </div>

              <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                Not Connected
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Information */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Dashboard Configuration
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              This dashboard currently uses a read-only configuration
              model. Changes to AI provider credentials, database
              credentials and other sensitive infrastructure should
              be managed through secure server-side configuration.
            </p>
          </div>

          <span className="inline-flex w-fit shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
            Read Only
          </span>
        </div>
      </section>
    </div>
  );
}