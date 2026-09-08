import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { setSessionCookie } from "@/lib/session";
import type { Role } from "@/lib/types";

function generateRegistrationId(): string {
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `OAK-2026-${rand()}-${rand()}`;
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    first_name, last_name, organization, sub_partner_program_area,
    role, email, phone, dietary_requirements, accessibility_requirements,
    travel_requirements, accommodation_requirements,
  } = body as {
    first_name?: string; last_name?: string; organization?: string;
    sub_partner_program_area?: string | null; role?: Role; email?: string;
    phone?: string | null; dietary_requirements?: string | null;
    accessibility_requirements?: string | null; travel_requirements?: string | null;
    accommodation_requirements?: string | null;
  };

  if (!first_name || !last_name || !organization || !role || !email) {
    return NextResponse.json({ error: "Missing required field" }, { status: 400 });
  }

  const validRoles: Role[] = ["Partner", "OAK Staff", "Coordination Team", "Presenter", "Observer"];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const registration_id = generateRegistrationId();
  const qr_code_id = role === "Partner" ? registration_id : null;

  const { data, error } = await supabaseAdmin
    .from("participants")
    .insert({
      registration_id, first_name, last_name, organization,
      sub_partner_program_area, role, email, phone,
      dietary_requirements, accessibility_requirements,
      travel_requirements, accommodation_requirements, qr_code_id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await setSessionCookie(registration_id);

  const response = NextResponse.json({ role: data.role, registration_id: data.registration_id });
  response.cookies.set("oak_role", data.role, { path: "/", maxAge: 60 * 60 * 24 * 14 });
  return response;
}