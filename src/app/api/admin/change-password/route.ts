import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { getCurrentAdmin } from "@/lib/session";

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { current_password, new_password } = await request.json();
  if (!current_password || !new_password) {
    return NextResponse.json(
      { error: "Current and new password are required" },
      { status: 400 }
    );
  }
  if (new_password.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const { data: fullAdmin, error: lookupError } = await supabaseAdmin
    .from("admins")
    .select("id, password_hash")
    .eq("id", admin.id)
    .single();

  if (lookupError || !fullAdmin) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const currentMatches = await bcrypt.compare(current_password, fullAdmin.password_hash);
  if (!currentMatches) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  const newHash = await bcrypt.hash(new_password, 10);
  const { error: updateError } = await supabaseAdmin
    .from("admins")
    .update({ password_hash: newHash })
    .eq("id", admin.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}