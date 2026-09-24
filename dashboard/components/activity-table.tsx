"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Status } from "@/components/dashboard";

export type ActivityRow = {
  id: string;
  createdAt: string | null;
  customerId: string | null;
  customerName: string;
  customerPhone: string | null;
  toolName: string;
  action: string;
  status: string;
  callId: string | null;
  input: string;
  output: string;
  error: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function CallReference({ id }: { id: string | null }) {
  if (!id) return <span>—</span>;
  const shortId = id.length > 10 ? `${id.slice(0, 8)}…` : id;
  return <Link className="text-link activity-call-link" href={`/calls/${id}`} title={id}>{shortId}</Link>;
}

export function ActivityTable({ rows }: { rows: ActivityRow[] }) {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<ActivityRow | null>(null);

  const actions = useMemo(() => [...new Set(rows.map((row) => row.action))].sort((a, b) => a.localeCompare(b)), [rows]);
  const statuses = useMemo(() => [...new Set(rows.map((row) => row.status))].sort((a, b) => a.localeCompare(b)), [rows]);
  const filtered = useMemo(() => rows.filter((row) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${row.customerName} ${row.customerPhone ?? ""}`.toLowerCase().includes(query);
    return matchesSearch && (!action || row.action === action) && (!status || row.status === status);
  }), [rows, search, action, status]);

  if (!rows.length) return <div className="activity-empty"><div className="empty-icon">✦</div><b>No AI activity yet</b><span>Actions performed by the AI agent, such as creating leads, checking availability, booking appointments, and sending catalogues, will appear here.</span></div>;

  return <>
    <div className="table-tools activity-tools">
      <label className="search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer or phone" /></label>
      <select aria-label="Filter by action" value={action} onChange={(event) => setAction(event.target.value)}><option value="">All actions</option>{actions.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      <span className="row-count">{filtered.length} activities</span>
    </div>
    <div className="table-wrap"><table className="activity-table"><thead><tr><th>Time</th><th>Customer</th><th>Action</th><th>Status</th><th>Related call</th><th>Details</th></tr></thead>
      <tbody>{filtered.map((row) => <tr key={row.id}>
        <td>{formatDate(row.createdAt)}</td>
        <td><div className="customer-cell"><span className="mini-avatar">{row.customerId ? row.customerName.charAt(0).toUpperCase() : "S"}</span><span><b>{row.customerId ? row.customerName : "System / Unknown customer"}</b>{row.customerId && row.customerPhone && <small>{row.customerPhone}</small>}</span></div></td>
        <td>{row.action}</td><td><Status value={row.status} /></td><td><CallReference id={row.callId} /></td>
        <td><button className="activity-details-button" type="button" onClick={() => setSelected(row)}>Details</button></td>
      </tr>)}
      {filtered.length === 0 && <tr><td className="empty-cell" colSpan={6}><b>No matching activity</b><span>Try a different customer, action, or status filter.</span></td></tr>}
      </tbody></table></div>

    {selected && <div className="activity-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <section className="activity-modal" role="dialog" aria-modal="true" aria-labelledby="activity-detail-title">
        <header className="activity-modal-header"><div><div className="eyebrow">AI ACTIVITY DETAIL</div><h2 id="activity-detail-title">{selected.action}</h2></div><button className="activity-modal-close" type="button" aria-label="Close details" onClick={() => setSelected(null)}>×</button></header>
        <div className="detail-list activity-detail-summary">
          <div><span>Action</span><b>{selected.action}</b></div><div><span>Status</span><b><Status value={selected.status} /></b></div>
          <div><span>Time</span><b>{formatDate(selected.createdAt)}</b></div><div><span>Customer</span><b>{selected.customerId ? selected.customerName : "System / Unknown customer"}</b></div>
          <div><span>Customer phone</span><b>{selected.customerId ? selected.customerPhone || "Not available" : "Not available"}</b></div>
          <div><span>Related call</span><b><CallReference id={selected.callId} /></b></div>
        </div>
        <JsonBlock title="Input" value={selected.input} />
        <JsonBlock title="Output" value={selected.output} />
        {selected.error && <JsonBlock title="Error" value={selected.error} error />}
      </section>
    </div>}
  </>;
}

function JsonBlock({ title, value, error = false }: { title: string; value: string; error?: boolean }) {
  return <section className={`activity-json-block${error ? " activity-json-error" : ""}`}><h3>{title}</h3><pre>{value || "Not available"}</pre></section>;
}
