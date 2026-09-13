import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PAGE_ACCESS, type Role } from "@/lib/types";

const MASTER_ONLY_PATHS = ["/admin-manage"];
const ADMIN_ONLY_PATHS = ["/checkin", "/attendance", "/admin-change-password"];

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isMaster = request.cookies.get("oak_is_master")?.value === "true";
  const hasAdminSession = request.cookies.has("oak_admin_id");

  // Master bypasses every gate below — full access, no exceptions.
  if (isMaster) {
    return NextResponse.next();
  }

  if (MASTER_ONLY_PATHS.includes(path)) {
    if (!hasAdminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin-login";
      return NextResponse.redirect(url);
    }
    // Logged in, but not master — send them somewhere they can actually use.
    const url = request.nextUrl.clone();
    url.pathname = "/checkin";
    return NextResponse.redirect(url);
  }

  if (ADMIN_ONLY_PATHS.includes(path)) {
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
  matcher: ["/qr-code", "/programme", "/partners", "/checkin", "/attendance", "/admin-manage", "/admin-change-password"],
};