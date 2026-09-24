/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActivityTable, type ActivityRow } from "@/components/activity-table";
import { DataNotice, Metric, PageHeading } from "@/components/dashboard";
import { callsByIds, customersByIds, safeActivityJson } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

const actionLabels: Record<string, string> = {
  vehicle_lookup: "Vehicle Lookup",
  create_lead: "Lead Created",
  check_availability: "Availability Checked",
  book_appointment: "Appointment Booked",
  send_catalogue: "Catalogue Sent",
  human_handoff: "Human Assistance Requested",
};

function readableAction(toolName: string | null) {
  if (!toolName) return "Unknown Action";
  return actionLabels[toolName] ?? toolName.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function readableStatus(value: unknown) {
  const status = String(value ?? "").trim().toLowerCase();
  if (status === "success") return "Success";
  if (status === "error") return "Error";
  if (status === "pending") return "Pending";
  return status ? status.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Not available";
}

export default async function ActivityPage() {
  const supabase = await createClient();
  const { data: toolCalls, error } = await supabase
    .from("tool_calls")
    .select("id,agent_id,customer_id,call_id,tool_name,input,output,status,error,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <><PageHeading eyebrow="WORKSPACE / AI" title="AI Activity" description="A live record of actions performed by the AI agent." /><DataNotice error={`AI activity could not be loaded: ${error.message}`} /></>;
  }

  const records = toolCalls ?? [];
  const [customerLookup, callLookup] = await Promise.all([
    customersByIds(records.map((record) => record.customer_id)),
    callsByIds(records.map((record) => record.call_id)),
  ]);

  const activities: ActivityRow[] = records.map((record: any) => {
    const customer = record.customer_id ? customerLookup.data.get(record.customer_id) : null;
    const name = customer ? [customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Unnamed customer" : "Unknown customer";
    return {
      id: record.id,
      createdAt: record.created_at,
      customerId: record.customer_id,
      customerName: name,
      customerPhone: customer?.phone ?? null,
      toolName: record.tool_name ?? "",
      action: readableAction(record.tool_name),
      status: readableStatus(record.status),
      callId: record.call_id ? callLookup.data.get(record.call_id)?.id ?? record.call_id : null,
      input: safeActivityJson(record.input),
      output: safeActivityJson(record.output),
      error: record.error ? safeActivityJson(record.error) : null,
    };
  });

  const today = new Date().toISOString().slice(0, 10);
  const successful = records.filter((record) => String(record.status ?? "").toLowerCase() === "success").length;
  const errors = records.filter((record) => String(record.status ?? "").toLowerCase() === "error").length;
  const todayCount = records.filter((record) => typeof record.created_at === "string" && record.created_at.startsWith(today)).length;
  const unresolvedCustomers = records.filter((record) => record.customer_id && !customerLookup.data.has(record.customer_id)).length;

  return <>
    <PageHeading eyebrow="WORKSPACE / AI" title="AI Activity" description="A live record of actions performed by the AI agent." />
    <div className="metric-grid activity-metrics">
      <Metric label="Total Activities" value={records.length} note="Recorded tool actions" icon="✦" />
      <Metric label="Successful" value={successful} note="Actions marked success" icon="✓" tone="green" />
      <Metric label="Errors" value={errors} note="Actions marked error" icon="!" tone="orange" />
      <Metric label="Today's Activity" value={todayCount} note="Based on UTC date" icon="◷" tone="violet" />
    </div>
    <section className="panel card activity-panel"><ActivityTable rows={activities} /></section>
    {customerLookup.error && <DataNotice error={`Customer details could not be loaded: ${customerLookup.error}`} />}
    {!customerLookup.error && unresolvedCustomers > 0 && <DataNotice error={`${unresolvedCustomers} activity record(s) reference customers not visible to this Supabase query. Check the customer IDs and existing customers SELECT policy for the current role.`} />}
    {callLookup.error && <DataNotice error={`Related call references could not be checked: ${callLookup.error}`} />}
  </>;
}
