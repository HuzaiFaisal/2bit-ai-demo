/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const nav = [["Overview", "/", "◫"], ["Calls", "/calls", "◉"], ["AI Activity", "/activity", "✦"], ["Leads", "/leads", "↗"], ["Appointments", "/appointments", "▦"], ["Customers", "/customers", "♙"], ["Conversations", "/conversations", "▤"], ["Human Handoff", "/handoff", "↗"]];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return <div className="shell"><aside className="sidebar"><Link className="brand" href="/"><span className="brand-mark">2</span><span><b>2BIT AI</b><small>AI Customer System</small></span></Link><div className="nav-label">WORKSPACE</div><nav>{nav.map(([label, href, icon]) => <Link key={href} href={href} className={`nav-link ${path === href || (href !== "/" && path.startsWith(href)) ? "selected" : ""}`}><span className="nav-icon">{icon}</span>{label}</Link>)}</nav><div className="agent-card"><div className="avatar">S</div><span><b>Saad</b><small>AI Sales Agent</small></span><i>Active</i></div></aside><main className="main-area"><header className="topbar"><span>2Bit Motors Saudi <span className="crumb">/ Operations</span></span><span className="live-dot">● &nbsp;System overview</span></header><div className="content">{children}</div></main></div>;
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) { return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>; }

export function Metric({ label, value, note, icon, tone = "blue" }: { label: string; value: string | number; note: string; icon: string; tone?: string }) { return <div className="metric card"><div className={`metric-icon ${tone}`}>{icon}</div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></div>; }

type TableCell = "customer" | "name" | "date" | "duration" | "boolean" | "human" | "status" | "channel" | "reason" | "call-link" | "success";
type TableColumn = { label: string; key: string; cell?: TableCell; fallbackKey?: string; hrefPrefix?: string };

export function DataTable({ columns, rows, searchKeys = [], filters = [], empty = "No records found.", rowHrefPrefix }: { columns: TableColumn[]; rows: Record<string, any>[]; searchKeys?: string[]; filters?: { key: string; label: string; options: string[] }[]; empty?: string; rowHrefPrefix?: string }) {
  const params = useSearchParams(); const [query, setQuery] = useState("");
  const getValue = (row: any, key: string) => key.split(".").reduce((value: any, part) => value?.[part], row);
  const filtered = useMemo(() => rows.filter(row => (!query || searchKeys.some(key => String(getValue(row, key) ?? "").toLowerCase().includes(query.toLowerCase()))) && filters.every(filter => !params.get(filter.key) || String(getValue(row, filter.key) ?? "").toLowerCase() === params.get(filter.key)?.toLowerCase())), [rows, query, searchKeys, filters, params]);
  const formatDate = (value: unknown) => value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(String(value))) : "Not available";
  const cellContent = (row: Record<string, any>, column: TableColumn) => {
    const value = getValue(row, column.key) ?? (column.fallbackKey ? getValue(row, column.fallbackKey) : undefined);
    if (column.cell === "customer") {
      const name = [row.customers?.first_name, row.customers?.last_name].filter(Boolean).join(" ") || "Unknown customer";
      return <div className="customer-cell"><span className="mini-avatar">{name.charAt(0).toUpperCase()}</span><span><b>{name}</b>{(row.customer_phone || row.customers?.phone) && <small>{row.customer_phone || row.customers.phone}</small>}</span></div>;
    }
    if (column.cell === "name") return [row.first_name, row.last_name].filter(Boolean).join(" ") || "Unnamed customer";
    if (column.cell === "date") return formatDate(value);
    if (column.cell === "duration") return value == null ? "Not available" : `${Math.floor(Number(value) / 60)}m ${Number(value) % 60}s`;
    if (column.cell === "boolean") return value == null ? "Not available" : String(value);
    if (column.cell === "human") return value == null ? "Not available" : value ? "Requested" : "No";
    if (column.cell === "status") return <Status value={value} />;
    if (column.cell === "channel") return <span className="status"><i />{String(value ?? "Not available")}</span>;
    if (column.cell === "reason") return getValue(row, "input.reason") || getValue(row, "input.message") || getValue(row, "input.details") || "Reason not recorded";
    if (column.cell === "call-link") return value ? <Link href={`/calls/${value}`} className="text-link">{String(value)}</Link> : "Not available";
    if (column.cell === "success") return row.error ? "No" : (["success", "succeeded", "completed"].includes(String(row.status).toLowerCase()) ? "Yes" : "Not confirmed");
    if (column.hrefPrefix && row.id) return <Link href={`${column.hrefPrefix}${row.id}`} className="text-link">{value ?? "Not available"}</Link>;
    return value == null || value === "" ? "Not available" : String(value);
  };
  const rowUrl = (row: Record<string, any>) => rowHrefPrefix && row.id ? `${rowHrefPrefix}${row.id}` : null;
  return <><div className="table-tools"><label className="search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search records" /></label>{filters.map(filter => <select key={filter.key} aria-label={filter.label} value={params.get(filter.key) ?? ""} onChange={event => { const url = new URL(window.location.href); if (event.target.value) url.searchParams.set(filter.key, event.target.value); else url.searchParams.delete(filter.key); window.history.replaceState(null, "", url); }}><option value="">All {filter.label}</option>{filter.options.map(option => <option key={option} value={option}>{option}</option>)}</select>)}<span className="row-count">{filtered.length} records</span></div><div className="table-wrap"><table><thead><tr>{columns.map(column => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>{filtered.map((row, i) => { const href = rowUrl(row); return <tr key={row.id ?? i} className={href ? "clickable-row" : undefined} onClick={href ? () => { window.location.href = href; } : undefined} onKeyDown={href ? event => { if (event.key === "Enter") window.location.href = href; } : undefined} tabIndex={href ? 0 : undefined}>{columns.map(column => <td key={column.key}>{cellContent(row, column)}</td>)}</tr>; })}{filtered.length === 0 && <tr><td className="empty-cell" colSpan={columns.length}><div className="empty-icon">⌁</div><b>{empty}</b><span>Records will appear here when available in your workspace.</span></td></tr>}</tbody></table></div></>;
}

export function Status({ value }: { value: unknown }) { const text = String(value ?? "Unknown"); return <span className={`status status-${text.toLowerCase().replace(/[^a-z]+/g, "-")}`}><i />{text.replaceAll("_", " ")}</span>; }
export function CustomerCell({ name, phone }: { name: string; phone?: string }) { return <div className="customer-cell"><span className="mini-avatar">{name.charAt(0).toUpperCase()}</span><span><b>{name}</b>{phone && <small>{phone}</small>}</span></div>; }
export function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) { return <section className="panel card"><div className="panel-heading"><h2>{title}</h2>{action}</div>{children}</section>; }
export function DataNotice({ error, empty = false }: { error?: string | null; empty?: boolean }) { return <div className={error ? "notice error-notice" : "notice"}><span>{error ? "!" : "i"}</span><div><b>{error ? "Data could not be loaded" : empty ? "No data yet" : "Workspace data"}</b><p>{error || (empty ? "When records are added to Supabase, they will appear here." : "Data is shown from your connected Supabase workspace.")}</p></div></div>; }

export function StatHeader({ count, label }: { count: number; label: string }) { return <div className="stat-header"><b>{count}</b><span>{label}</span></div>; }
