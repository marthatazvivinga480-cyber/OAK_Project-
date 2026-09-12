import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";
import type { Participant } from "@/lib/types";
import { signCookieValue, verifyCookieValue } from "./cookieSecurity";

const ADMIN_COOKIE = "oak_admin_id";
const SESSION_COOKIE = "oak_registration_id";

export async function setAdminSessionCookie(adminId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, signCookieValue(adminId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const signedAdminId = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!signedAdminId) return null;

  const adminId = verifyCookieValue(signedAdminId);
  if (!adminId) return null;

  const { data, error } = await supabaseAdmin
    .from("admins")
    .select("id, username, is_master")
    .eq("id", adminId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function setSessionCookie(registrationId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, signCookieValue(registrationId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function getCurrentParticipant(): Promise<Participant | null> {
  const cookieStore = await cookies();
  const signedRegistrationId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!signedRegistrationId) return null;

  const registrationId = verifyCookieValue(signedRegistrationId);
  if (!registrationId) return null;

  const { data, error } = await supabaseAdmin
    .from("participants")
    .select("*")
    .eq("registration_id", registrationId)
    .single();

  if (error || !data) return null;
  return data as Participant;
}

export async function getAuthorizedStaff() {
  // Returns either an Admin or a Coordination Team participant
  const admin = await getCurrentAdmin();
  if (admin) return { type: "admin", id: admin.id, role: "Coordination Team", is_master: admin.is_master };
  
  const participant = await getCurrentParticipant();
  if (participant && participant.role === "Coordination Team") {
    return { type: "participant", id: participant.id, role: "Coordination Team" };
  }
  
  return null;
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete("oak_role");
}