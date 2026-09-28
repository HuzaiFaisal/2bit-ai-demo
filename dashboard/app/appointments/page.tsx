// 




"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DataNotice, DataTable, PageHeading } from "@/components/dashboard";
import { createClient } from "@supabase/supabase-js";

export default function Appointments() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );

      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("*, customers(id, first_name, last_name, phone)")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setData(appointments || []);
      }
      setLoading(false);
    }
    fetchAppointments();
  }, []);

  const dates = [...new Set(data.map((r: any) => r.appointment_date).filter(Boolean))] as string[];
  
  const columns = [
    { label: "Customer", key: "customer", cell: "customer" as const },
    { label: "Vehicle", key: "vehicle" },
    { label: "Appointment date", key: "appointment_date" },
    { label: "Appointment time", key: "appointment_time" },
    { label: "Appointment type", key: "appointment_type" },
    { label: "Status", key: "status", cell: "status" as const },
    { label: "Created", key: "created_at", cell: "date" as const },
  ];

  return (
    <>
      <PageHeading eyebrow="WORKSPACE / SCHEDULING" title="Appointments" description="Review scheduled customer appointments." />
      <section className="panel card">
        {loading ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#666" }}>Loading live appointments...</div>
        ) : (
          <DataTable columns={columns} rows={data} searchKeys={["vehicle", "appointment_type", "appointment_date", "appointment_time", "status", "customers.phone", "customers.first_name", "customers.last_name"]} filters={[{ key: "status", label: "status", options: ["pending", "confirmed", "completed", "cancelled"] }, { key: "appointment_date", label: "date", options: dates }]} empty="No appointments found." />
        )}
      </section>
      {error && <DataNotice error={error} />}
    </>
  );
}