import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { setSessionCookie } from "@/lib/session";
import type { Role } from "@/lib/types";
import crypto from "crypto";
import { signCookieValue } from "@/lib/cookieSecurity";

function generateRegistrationId(): string {
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `OAK-2026-${rand.slice(0,4)}-${rand.slice(4,8)}`;
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

  let assignedRole = role;
  // Prevent unauthorized privilege escalation
  if (["Coordination Team", "OAK Staff"].includes(role)) {
    const accessCode = body.staff_access_code; // Expecting a staff code if registering as staff
    const expectedCode = process.env.STAFF_ACCESS_CODE || "OAK-STAFF-2026";
    if (accessCode !== expectedCode) {
      assignedRole = "Partner"; // Fallback to safe role
    }
  }

  let registration_id = "";
  let data = null;
  let attempts = 0;

  while (attempts < 3) {
    registration_id = generateRegistrationId();
    const qr_code_id = assignedRole === "Partner" ? registration_id : null;

    const { data: insertData, error } = await supabaseAdmin
      .from("participants")
      .insert({
        registration_id, first_name, last_name, organization,
        sub_partner_program_area, role: assignedRole, email, phone,
        dietary_requirements, accessibility_requirements,
        travel_requirements, accommodation_requirements, qr_code_id,
      })
      .select()
      .single();

    if (!error) {
      data = insertData;
      break;
    }
    
    if (error.code !== "23505") { // Not a unique constraint violation
      return NextResponse.json({ error: "Failed to register. Please try again." }, { status: 500 });
    }
    attempts++;
  }

  if (!data) {
    return NextResponse.json({ error: "Failed to generate unique ID" }, { status: 500 });
  }

  await setSessionCookie(registration_id);

  const response = NextResponse.json({ role: data.role, registration_id: data.registration_id });
  response.cookies.set("oak_role", signCookieValue(data.role), { path: "/", maxAge: 60 * 60 * 24 * 14 });
  return response;
}