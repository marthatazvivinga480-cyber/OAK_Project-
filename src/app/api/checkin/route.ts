import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { getAuthorizedStaff } from "@/lib/session";

export async function POST(request: Request) {
  const scanner = await getAuthorizedStaff();

  if (!scanner) {
    return NextResponse.json({ error: "Not authorized to check in participants" }, { status: 403 });
  }

  const { qr_code_id } = await request.json();
  if (!qr_code_id) {
    return NextResponse.json({ error: "QR Code Not Recognized" }, { status: 400 });
  }

  const { data: participant, error: lookupError } = await supabaseAdmin
    .from("participants")
    .select("*")
    .eq("qr_code_id", qr_code_id)
    .maybeSingle();

  if (lookupError || !participant) {
    return NextResponse.json({ error: "Participant Not Found" }, { status: 404 });
  }

  const adminId = scanner.type === "admin" ? scanner.id : null; // Only store UUID if it matches admin schema

  const { data: checkin, error: insertError } = await supabaseAdmin
    .from("checkins")
    .insert({ participant_id: participant.id, checked_in_by: adminId })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "Duplicate QR Code — already checked in today" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to record check-in" }, { status: 500 });
  }

  // Optimize counting using promise.all
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Harare", year: "numeric", month: "2-digit", day: "2-digit" });
  const parts = formatter.formatToParts(new Date());
  const year = parts.find(p => p.type === "year")?.value;
  const month = parts.find(p => p.type === "month")?.value;
  const day = parts.find(p => p.type === "day")?.value;
  const todayStr = `${year}-${month}-${day}`;

  const [registeredRes, checkedInRes] = await Promise.all([
    supabaseAdmin.from("participants").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("checkins").select("id", { count: "exact", head: true }).eq("check_in_date", todayStr)
  ]);

  return NextResponse.json({
    participant: {
      first_name: participant.first_name,
      last_name: participant.last_name,
      organization: participant.organization,
      role: participant.role,
    },
    check_in_time: checkin.check_in_time,
    live_stats: { 
      total_registered: registeredRes.count ?? 0, 
      total_checked_in: checkedInRes.count ?? 0 
    },
  });
}