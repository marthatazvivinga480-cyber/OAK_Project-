import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { getAuthorizedStaff } from "@/lib/session";
import type { Role } from "@/lib/types";

export async function GET(request: Request) {
  const viewer = await getAuthorizedStaff();
  if (!viewer) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const nameFilter = searchParams.get("name");
  const orgFilter = searchParams.get("organization");
  const roleFilter = searchParams.get("role") as Role | null;
  const statusFilter = searchParams.get("status"); 

  let query = supabaseAdmin
    .from("participants")
    .select("*, checkins!participant_id(check_in_time)", { count: 'exact' });

  if (nameFilter) {
    query = query.or(`first_name.ilike.%${nameFilter}%,last_name.ilike.%${nameFilter}%`);
  }
  if (orgFilter) {
    query = query.ilike("organization", `%${orgFilter}%`);
  }
  if (roleFilter) {
    query = query.eq("role", roleFilter);
  }
  // statusFilter needs a bit of a trick in Supabase. We can't easily filter by the child table existence in a simple select using postgrest syntax efficiently without inner join. 
  // We'll use the inner join approach if statusFilter is checked_in, and we can't easily do pending without a subquery or a view. 
  // For now we'll do the child table approach if they selected checked_in:
  if (statusFilter === "checked_in") {
    query = supabaseAdmin
      .from("participants")
      .select("*, checkins!inner(check_in_time)", { count: 'exact' });
      // re-apply other filters
      if (nameFilter) query = query.or(`first_name.ilike.%${nameFilter}%,last_name.ilike.%${nameFilter}%`);
      if (orgFilter) query = query.ilike("organization", `%${orgFilter}%`);
      if (roleFilter) query = query.eq("role", roleFilter);
  }

  // To prevent loading all 1000s of participants into memory, we will just fetch the data. 
  // However, to get overall stats, we shouldn't rely on the full table pull. We will do separate counts.
  
  const [participantsRes, statsRes] = await Promise.all([
    query.limit(1000), // Protect against massive payload, could add proper pagination later
    
    // Fetch stats via counts
    Promise.all([
      supabaseAdmin.from("participants").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("checkins").select("id", { count: "exact", head: true }),
      // Role breakdowns would ideally be an RPC call for group by, but we'll fetch roles only to count them
      supabaseAdmin.from("participants").select("role")
    ])
  ]);

  if (participantsRes.error) {
    return NextResponse.json({ error: participantsRes.error.message }, { status: 500 });
  }

  const [totalRegRes, totalCheckRes, rolesRes] = statsRes;
  const totalRegistered = totalRegRes.count ?? 0;
  const totalCheckedIn = totalCheckRes.count ?? 0;

  const roleBreakdown: Record<Role, number> = {
    Partner: 0,
    "OAK Staff": 0,
    "Coordination Team": 0,
    Presenter: 0,
    Observer: 0,
  };
  
  if (rolesRes.data) {
    for (const p of rolesRes.data) {
      if (roleBreakdown[p.role as Role] !== undefined) {
        roleBreakdown[p.role as Role] += 1;
      }
    }
  }

  // manual filter for pending if needed, but bounded to 1000 items
  let rows = participantsRes.data;
  if (statusFilter === "pending") {
    rows = rows.filter((p: any) => !p.checkins || p.checkins.length === 0);
  }

  return NextResponse.json({
    stats: {
      total_registered: totalRegistered,
      total_checked_in: totalCheckedIn,
      attendance_percentage:
        totalRegistered === 0 ? 0 : Math.round((totalCheckedIn / totalRegistered) * 100),
      role_breakdown: roleBreakdown,
    },
    participants: rows.map((p: any) => ({
      id: p.id,
      full_name: `${p.first_name} ${p.last_name}`,
      organization: p.organization,
      role: p.role,
      registration_date: p.registration_date,
      attendance_status: (p.checkins && p.checkins.length > 0) ? "checked_in" : "pending",
      check_in_time: p.checkins && p.checkins.length > 0 ? p.checkins[0]?.check_in_time : null,
    })),
  });
}