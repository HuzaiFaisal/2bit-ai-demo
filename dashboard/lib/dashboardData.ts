import { createClient } from "@/lib/supabase/server";

export async function getDashboardData() {
  const supabase = await createClient();

  const [
    callsResult,
    leadsResult,
    appointmentsResult,
  ] = await Promise.all([
    supabase
      .from("calls")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })
      .limit(5),
  ]);

  const calls = callsResult.data ?? [];
  const leads = leadsResult.data ?? [];
  const appointments = appointmentsResult.data ?? [];

  /*
   * Get all customer IDs used by the dashboard records.
   */
  const customerIds = [
    ...calls.map((call) => call.customer_id),
    ...leads.map((lead) => lead.customer_id),
    ...appointments.map((appointment) => appointment.customer_id),
  ].filter(Boolean);

  const uniqueCustomerIds = [...new Set(customerIds)];

  /*
   * Retrieve customer information.
   */
  let customers: any[] = [];

  if (uniqueCustomerIds.length > 0) {
    const customersResult = await supabase
      .from("customers")
      .select("id, name, mobile")
      .in("id", uniqueCustomerIds);

    customers = customersResult.data ?? [];
  }

  /*
   * Helper for finding a customer.
   */
  const getCustomer = (customerId: string | null) => {
    return customers.find(
      (customer) => customer.id === customerId
    );
  };

  /*
   * Attach customer information to calls.
   */
  const callsWithCustomers = calls.map((call) => ({
    ...call,
    customer: getCustomer(call.customer_id),
  }));

  /*
   * Attach customer information to leads.
   */
  const leadsWithCustomers = leads.map((lead) => ({
    ...lead,
    customer: getCustomer(lead.customer_id),
  }));

  /*
   * Attach customer information to appointments.
   */
  const appointmentsWithCustomers = appointments.map(
    (appointment) => ({
      ...appointment,
      customer: getCustomer(appointment.customer_id),
    })
  );

  /*
   * Calculate AI resolved calls.
   *
   * A call is considered AI-resolved when:
   * - it does not need a human
   * - it completed successfully
   */
  const completedCalls = calls.filter(
    (call) => call.status === "completed"
  );

  const aiResolvedCalls = completedCalls.filter(
    (call) => call.needs_human === false
  );

  const aiResolvedPercentage =
    completedCalls.length > 0
      ? Math.round(
          (aiResolvedCalls.length / completedCalls.length) * 100
        )
      : 0;

  return {
    calls: callsWithCustomers,
    leads: leadsWithCustomers,
    appointments: appointmentsWithCustomers,

    stats: {
      calls: calls.length,
      leads: leads.length,
      appointments: appointments.length,
      aiResolved: aiResolvedPercentage,
    },

    errors: {
      calls: callsResult.error?.message ?? null,
      leads: leadsResult.error?.message ?? null,
      appointments: appointmentsResult.error?.message ?? null,
    },
  };
}