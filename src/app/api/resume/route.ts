import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const { registration_id, email } = await request.json();

  if (!registration_id && !email) {
    return NextResponse.json(
      { error: "Provide a registration ID or email" },
      { status: 400 }
    );
  }

  const query = supabaseAdmin.from("participants").select("*");
  const { data: participant, error } = registration_id
    ? await query.eq("registration_id", registration_id).maybeSingle()
    : await query.eq("email", email).maybeSingle();

  if (error || !participant) {
    return NextResponse.json(
      { error: "No matching registration found" },
      { status: 404 }
    );
  }

  await setSessionCookie(participant.registration_id);

  const response = NextResponse.json({ role: participant.role });
  response.cookies.set("oak_role", participant.role, {
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}