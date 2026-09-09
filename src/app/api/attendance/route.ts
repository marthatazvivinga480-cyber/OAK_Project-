import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { getCurrentParticipant } from "@/lib/session";
import type { Role } from "@/lib/types";

export async function GET(request: Request) {
  const viewer = await getCurrentParticipant();
  if (!viewer || viewer.role !== "Coordination Team") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const nameFilter = searchParams.get("name");
  const orgFilter = searchParams.get("organization");
  const roleFilter = searchParams.get("role") as Role | null;
  const statusFilter = searchParams.get("status"); 

  
  const { data: participants, error } = await supabaseAdmin
    .from("participants")
    .select("*, checkins!participant_id(check_in_time)")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type ParticipantWithCheckins = (typeof participants)[number];
  let rows = participants as ParticipantWithCheckins[];

  if (nameFilter) {
    const q = nameFilter.toLowerCase();
    rows = rows.filter((p) =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(q)
    );
  }
  if (orgFilter) {
    rows = rows.filter((p) =>
      p.organization.toLowerCase().includes(orgFilter.toLowerCase())
    );
  }
  if (roleFilter) {
    rows = rows.filter((p) => p.role === roleFilter);
  }
  if (statusFilter === "checked_in") {
    rows = rows.filter((p) => p.checkins.length > 0);
  } else if (statusFilter === "pending") {
    rows = rows.filter((p) => p.checkins.length === 0);
  }

  const totalRegistered = participants.length;
  const totalCheckedIn = participants.filter((p) => p.checkins.length > 0).length;

  const roleBreakdown: Record<Role, number> = {
    Partner: 0,
    "OAK Staff": 0,
    "Coordination Team": 0,
    Presenter: 0,
    Observer: 0,
  };
  for (const p of participants) {
    roleBreakdown[p.role as Role] += 1;
  }

  return NextResponse.json({
    stats: {
      total_registered: totalRegistered,
      total_checked_in: totalCheckedIn,
      attendance_percentage:
        totalRegistered === 0 ? 0 : Math.round((totalCheckedIn / totalRegistered) * 100),
      role_breakdown: roleBreakdown,
    },
    participants: rows.map((p) => ({
      id: p.id,
      full_name: `${p.first_name} ${p.last_name}`,
      organization: p.organization,
      role: p.role,
      registration_date: p.registration_date,
      attendance_status: p.checkins.length > 0 ? "checked_in" : "pending",
      check_in_time: p.checkins[0]?.check_in_time ?? null,
    })),
  });
}