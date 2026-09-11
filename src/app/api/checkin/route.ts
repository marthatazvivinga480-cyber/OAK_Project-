import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { getCurrentAdmin } from "@/lib/session";

export async function POST(request: Request) {
  const scanner = await getCurrentAdmin();

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

  const { data: checkin, error: insertError } = await supabaseAdmin
    .from("checkins")
    .insert({ participant_id: participant.id, checked_in_by: scanner.id })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "Duplicate QR Code — already checked in today" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { count: totalRegistered } = await supabaseAdmin
  .from("participants")
  .select("*", { count: "exact", head: true });

const { count: totalCheckedIn } = await supabaseAdmin
  .from("checkins")
  .select("*", { count: "exact", head: true })
  .eq("check_in_date", new Date().toISOString().split("T")[0]);

return NextResponse.json({
  participant: {
    first_name: participant.first_name,
    last_name: participant.last_name,
    organization: participant.organization,
    role: participant.role,
  },
  check_in_time: checkin.check_in_time,
  live_stats: { total_registered: totalRegistered ?? 0, total_checked_in: totalCheckedIn ?? 0 },
});

  return NextResponse.json({
    participant: {
      first_name: participant.first_name,
      last_name: participant.last_name,
      organization: participant.organization,
      role: participant.role,
    },
    check_in_time: checkin.check_in_time,
  });
}