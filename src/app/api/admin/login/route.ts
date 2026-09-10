import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { setAdminSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const { data: admin, error } = await supabaseAdmin
    .from("admins")
    .select("id, password_hash, is_master")
    .eq("username", username)
    .maybeSingle();

  if (error || !admin) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(password, admin.password_hash);
  if (!passwordMatches) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  await setAdminSessionCookie(admin.id);
  return NextResponse.json({ is_master: admin.is_master });
}