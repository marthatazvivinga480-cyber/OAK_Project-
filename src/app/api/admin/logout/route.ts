import { NextResponse } from "next/server";
import { clearSessionCookies } from "@/lib/session";

export async function POST() {
  await clearSessionCookies();
  const response = NextResponse.json({ success: true });
  response.cookies.delete("oak_is_master");
  return response;
}

