import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PAGE_ACCESS, type Role } from "@/lib/types";

const ADMIN_ONLY_PATHS = ["/checkin", "/attendance", "/admin-manage"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (ADMIN_ONLY_PATHS.includes(path)) {
    const hasAdminSession = request.cookies.has("oak_admin_id");
    if (!hasAdminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin-login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

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
  matcher: ["/qr-code", "/programme", "/partners", "/checkin", "/attendance", "/admin-manage"],
};