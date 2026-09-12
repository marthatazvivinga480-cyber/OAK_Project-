import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { setSessionCookie } from "@/lib/session";
import { signCookieValue } from "@/lib/cookieSecurity";

export async function POST(request: Request) {
  const { registration_id, email } = await request.json();

  if (!registration_id || !email) {
    return NextResponse.json(
      { error: "Provide both your Registration ID and Email" },
      { status: 400 }
    );
  }

  const { data: participant, error } = await supabaseAdmin
    .from("participants")
    .select("*")
    .eq("registration_id", registration_id)
    .eq("email", email)
    .maybeSingle();

  if (error || !participant) {
    return NextResponse.json(
      { error: "Invalid registration ID or email" },
      { status: 401 }
    );
  }

  await setSessionCookie(participant.registration_id);

  const response = NextResponse.json({ role: participant.role });
  response.cookies.set("oak_role", signCookieValue(participant.role), {
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
    httpOnly: false, // Accessible by frontend if needed, though proxy uses httpOnly
  });
  return response;
}