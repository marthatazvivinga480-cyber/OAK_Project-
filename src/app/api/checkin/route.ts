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

  // Insert directly and let the database's unique constraint
  // (participant_id, check_in_date) catch duplicates atomically —
  // this closes the race condition a separate "check, then insert"
  // step had if two scanners hit the same participant at once.
  const { data: checkin, error: insertError } = await supabaseAdmin
    .from("checkins")
    .insert({ participant_id: participant.id, checked_in_by: scanner.id })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      // Postgres unique_violation — the constraint did its job.
      return NextResponse.json(
        { error: "Duplicate QR Code — already checked in today" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

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