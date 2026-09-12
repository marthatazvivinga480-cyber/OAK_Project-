import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { getCurrentParticipant } from "@/lib/session";

export async function POST(request: Request) {
  const participant = await getCurrentParticipant();
  if (!participant) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { session_id, note_text } = await request.json();
  if (!session_id || !note_text) {
    return NextResponse.json({ error: "Missing session_id or note_text" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("session_notes")
    .upsert(
      {
        session_id,
        participant_id: participant.id,
        note_text,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id,participant_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function GET(request: Request) {
  const participant = await getCurrentParticipant();
  if (!participant) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const session_id = searchParams.get("session_id");

  let query = supabaseAdmin
    .from("session_notes")
    .select("id, session_id, note_text, updated_at")
    .eq("participant_id", participant.id);

  if (session_id) {
    query = query.eq("session_id", session_id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}