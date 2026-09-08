import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";
import type { Participant } from "@/lib/types";

const SESSION_COOKIE = "oak_registration_id";

export async function setSessionCookie(registrationId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, registrationId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 days
  });
}

export async function getCurrentParticipant(): Promise<Participant | null> {
  const cookieStore = await cookies();
  const registrationId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!registrationId) return null;

  const { data, error } = await supabaseAdmin
    .from("participants")
    .select("*")
    .eq("registration_id", registrationId)
    .single();

  if (error || !data) return null;
  return data as Participant;
}