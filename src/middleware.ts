import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PAGE_ACCESS, type Role } from "@/lib/types";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const allowedRoles = PAGE_ACCESS[path];
  if (!allowedRoles) return NextResponse.next();

  const role = request.cookies.get("oak_role")?.value as Role | undefined;

  if (!role || !allowedRoles.includes(role)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("denied", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/qr-code", "/programme", "/partners", "/checkin", "/attendance"],
};