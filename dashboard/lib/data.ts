/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";

export async function records(table: string, select = "*") {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select(select).order("created_at", { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

export async function customersByIds(ids: (string | null | undefined)[]) {
  const uniqueIds = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  if (!uniqueIds.length) return { data: new Map<string, CustomerRecord>(), error: null as string | null };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("id,first_name,last_name,phone,email,language,created_at")
    .in("id", uniqueIds);
  const customerMap = new Map((data ?? []).map((customer) => [customer.id, customer as CustomerRecord]));
  return { data: customerMap, error: error?.message ?? null };
}

export async function callsByIds(ids: (string | null | undefined)[]) {
  const uniqueIds = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  if (!uniqueIds.length) return { data: new Map<string, { id: string }>(), error: null as string | null };

  const supabase = await createClient();
  const { data, error } = await supabase.from("calls").select("id").in("id", uniqueIds);
  return { data: new Map((data ?? []).map((call) => [call.id, call])), error: error?.message ?? null };
}

export async function recordsWithCustomers(table: string, select = "*") {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from(table)
    .select(select)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message, customerError: null, unresolvedCustomers: 0 };

  const records = (rows ?? []) as unknown as LinkedRecord[];
  const lookup = await customersByIds(records.map((row) => row.customer_id));
  const data = records.map((row) => ({
    ...row,
    customers: row.customer_id ? lookup.data.get(row.customer_id) ?? null : null,
  }));
  const unresolvedCustomers = data.filter((row) => row.customer_id && !row.customers).length;

  return { data, error: null, customerError: lookup.error, unresolvedCustomers };
}

export async function recordById(table: string, id: string, select = "*") {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select(select).eq("id", id).maybeSingle();
  return { data, error: error?.message ?? null };
}

export const display = (value: unknown) => value === null || value === undefined || value === "" ? "Not available" : String(value);
export const date = (value: unknown) => value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(String(value))) : "—";
export const personName = (customer: any) => customer ? [customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Unnamed customer" : "Unknown customer";

const sensitiveKey = /(?:secret|token|authorization|api[_-]?key|credential|password|cookie|private[_-]?key)/i;
const sensitiveText = /(authorization|api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|password|cookie)\s*[:=]\s*(["']?)[^\s,;"'}]+/gi;
const bearerText = /\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi;

export function safeActivityJson(value: unknown) {
  const scrub = (input: unknown, key = ""): unknown => {
    if (sensitiveKey.test(key)) return "[REDACTED]";
    if (typeof input === "string") return input.replace(sensitiveText, "$1: [REDACTED]").replace(bearerText, "Bearer [REDACTED]");
    if (Array.isArray(input)) return input.map((item) => scrub(item));
    if (input && typeof input === "object") {
      return Object.fromEntries(Object.entries(input).map(([childKey, childValue]) => [childKey, scrub(childValue, childKey)]));
    }
    return input;
  };

  let parsed = value;
  if (typeof value === "string") {
    try { parsed = JSON.parse(value); } catch { parsed = value; }
  }
  const safe = scrub(parsed);
  return typeof safe === "string" ? safe : JSON.stringify(safe, null, 2) ?? "Not available";
}

export type CustomerRecord = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email?: string | null;
  language?: string | null;
  created_at?: string | null;
};

type LinkedRecord = Record<string, unknown> & {
  customer_id?: string | null;
  customers?: CustomerRecord | null;
};
