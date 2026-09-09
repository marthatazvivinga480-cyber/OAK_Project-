import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { getCurrentAdmin } from "@/lib/session";

export async function POST(request: Request) {
  const requester = await getCurrentAdmin();
  if (!requester || !requester.is_master) {
    return NextResponse.json({ error: "Only the master account can manage admins" }, { status: 403 });
  }

  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabaseAdmin
    .from("admins")
    .insert({ username, password_hash, is_master: false })
    .select("id, username")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const requester = await getCurrentAdmin();
  if (!requester || !requester.is_master) {
    return NextResponse.json({ error: "Only the master account can manage admins" }, { status: 403 });
  }

  const { id } = await request.json();

  // Protect master accounts from deletion via the API entirely —
  // matches the original prototype's rule: no UI path to remove master.
  const { data: target } = await supabaseAdmin
    .from("admins")
    .select("is_master")
    .eq("id", id)
    .maybeSingle();

  if (target?.is_master) {
    return NextResponse.json({ error: "Cannot remove a master account" }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from("admins").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: id });
}