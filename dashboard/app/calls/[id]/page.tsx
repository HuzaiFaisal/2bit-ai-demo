/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { notFound } from "next/navigation";
import { DataNotice, PageHeading, Panel, Status } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/server";
import { customersByIds, date, display, personName } from "@/lib/data";

export default async function CallDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await createClient();
  const { data: call, error } = await db.from("calls").select("*").eq("id", id).maybeSingle();
  if (!call && !error) return notFound();
  const customerLookup = await customersByIds([call?.customer_id]);
  const customer = call?.customer_id ? customerLookup.data.get(call.customer_id) : null;
  const { data: tools, error: toolsError } = await db.from("tool_calls").select("*").eq("call_id", id).order("created_at", { ascending: false });
  const fields = [
    ["Customer", customer ? personName(customer) : "Not available"], ["Phone", call?.customer_phone || customer?.phone],
    ["Date", call?.created_at ? date(call.created_at) : null], ["Duration", call?.duration_seconds != null ? `${call.duration_seconds} seconds` : null], ["Status", call?.status],
    ["Vehicle interest", call?.vehicle_interest], ["Customer intent", call?.customer_intent], ["Budget", call?.budget], ["Lead quality", call?.lead_quality],
    ["Appointment requested", call?.appointment_requested], ["Appointment booked", call?.appointment_booked], ["Needs human", call?.needs_human],
  ];
  return <><PageHeading eyebrow="WORKSPACE / CALLS" title="Call details" description="Recorded call information and AI activity." action={<Link href="/calls" className="text-link">← All calls</Link>} />
    <div className="detail-grid"><Panel title="Call information"><div className="detail-card"><div className="detail-list">{fields.map(([label, value]) => <div key={label}><span>{label}</span><b>{display(value)}</b></div>)}</div></div></Panel>
      <Panel title="AI summary"><div className="detail-card content-block">{display(call?.summary)}</div></Panel></div>
    <div className="grid-equal"><Panel title="Transcript"><div className="detail-card content-block">{display(call?.transcript)}</div></Panel>
      <Panel title="Tool activity">{tools?.length ? <div className="activity-list">{tools.map((tool: any) => <div className="activity-item" key={tool.id}><span><b>{display(tool.tool_name)}</b><small>{date(tool.created_at)} · {display(tool.status)}</small><div className="content-block">{tool.error || JSON.stringify(tool.output ?? tool.input ?? "Not available", null, 2)}</div></span><Status value={tool.status} /></div>)}</div> : <div className="detail-card content-block">No tool activity recorded for this call.</div>}</Panel></div>
    <Panel title="Recording"><div className="detail-card">{call?.recording_url ? <><audio controls preload="none" src={call.recording_url} style={{ display: "block", width: "100%", marginBottom: 12 }} /><a className="link-button" href={call.recording_url} target="_blank" rel="noreferrer">Open recording in a new tab ↗</a></> : "Not available"}</div></Panel>
    {error && <DataNotice error={error.message} />}{toolsError && <DataNotice error={toolsError.message} />}
    {customerLookup.error && <DataNotice error={`Customer lookup query failed: ${customerLookup.error}`} />}
    {!customerLookup.error && call?.customer_id && !customer && <DataNotice error="This call references a customer that was not returned by the customers lookup. Check that customer_id exists in customers.id and that the current Supabase role has SELECT access under RLS." />}
  </>;
}
