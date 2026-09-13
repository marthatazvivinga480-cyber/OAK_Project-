import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { getCurrentAdmin } from "@/lib/session";

export async function POST(request: Request) {
  const requester = await getCurrentAdmin();
  if (!requester || !requester.is_master) {
    return NextResponse.json(
      { error: "Only the master account can reset admin passwords" },
      { status: 403 }
    );
  }

  const { id, new_password } = await request.json();
  if (!id || !new_password) {
    return NextResponse.json(
      { error: "Admin ID and new password are required" },
      { status: 400 }
    );
  }
  if (new_password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const { data: target } = await supabaseAdmin
    .from("admins")
    .select("is_master")
    .eq("id", id)
    .maybeSingle();

  if (target?.is_master) {
    return NextResponse.json(
      { error: "Cannot reset the master account password through this endpoint" },
      { status: 403 }
    );
  }

  const password_hash = await bcrypt.hash(new_password, 10);
  const { error } = await supabaseAdmin
    .from("admins")
    .update({ password_hash })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

