import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { getAuthorizedStaff } from "@/lib/session";
import type { Role } from "@/lib/types";

type AttendanceRow = {
  id: string;
  first_name: string;
  last_name: string;
  organization: string;
  role: Role;
  registration_date?: string | null;
  checkins?: Array<{ check_in_time?: string | null }> | null;
};

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
  if (statusFilter === "checked_in") {
    query = supabaseAdmin
      .from("participants")
      .select("*, checkins!inner(check_in_time)", { count: 'exact' });
      if (nameFilter) query = query.or(`first_name.ilike.%${nameFilter}%,last_name.ilike.%${nameFilter}%`);
      if (orgFilter) query = query.ilike("organization", `%${orgFilter}%`);
      if (roleFilter) query = query.eq("role", roleFilter);
  }

  const [participantsRes, statsRes] = await Promise.all([
    query.limit(1000),
    Promise.all([
      supabaseAdmin.from("participants").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("checkins").select("id", { count: "exact", head: true }),
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

  const rows = (participantsRes.data ?? []) as AttendanceRow[];
  const filteredRows = statusFilter === "pending"
    ? rows.filter((p) => !p.checkins || p.checkins.length === 0)
    : rows;

  return NextResponse.json({
    stats: {
      total_registered: totalRegistered,
      total_checked_in: totalCheckedIn,
      attendance_percentage:
        totalRegistered === 0 ? 0 : Math.round((totalCheckedIn / totalRegistered) * 100),
      role_breakdown: roleBreakdown,
    },
    participants: filteredRows.map((p) => ({
      id: p.id,
      full_name: `${p.first_name} ${p.last_name}`,
      organization: p.organization,
      role: p.role,
      registration_date: p.registration_date,
      attendance_status: p.checkins && p.checkins.length > 0 ? "checked_in" : "pending",
      check_in_time: p.checkins && p.checkins.length > 0 ? p.checkins[0]?.check_in_time : null,
    })),
  });
}