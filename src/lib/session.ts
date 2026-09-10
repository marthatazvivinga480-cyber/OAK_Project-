import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";
import type { Participant } from "@/lib/types";

const ADMIN_COOKIE = "oak_admin_id";

export async function setAdminSessionCookie(adminId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const adminId = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!adminId) return null;

  const { data, error } = await supabaseAdmin
    .from("admins")
    .select("id, username, is_master")
    .eq("id", adminId)
    .single();

  if (error || !data) return null;
  return data;
}

const SESSION_COOKIE = "oak_registration_id";

export async function setSessionCookie(registrationId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, registrationId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
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