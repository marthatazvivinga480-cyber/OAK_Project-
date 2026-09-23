import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyCookieValue } from "@/lib/cookieSecurity";
import { PAGE_ACCESS, type Role } from "@/lib/types";

const MASTER_ONLY_PATHS = ["/admin-manage", "/account/manage-admins"];
const ADMIN_ONLY_PATHS = ["/checkin", "/attendance", "/admin-change-password", "/account"];

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const adminCookieValue = request.cookies.get("oak_admin_id")?.value;
  const hasAdminSession = Boolean(adminCookieValue && verifyCookieValue(adminCookieValue));

  const masterCookieValue = request.cookies.get("oak_is_master")?.value;
  const isMaster = masterCookieValue ? verifyCookieValue(masterCookieValue) === "true" : false;

  if (MASTER_ONLY_PATHS.some((p) => path === p || path.startsWith(p + "/"))) {
    if (!hasAdminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin-login";
      return NextResponse.redirect(url);
    }
    if (!isMaster) {
      const url = request.nextUrl.clone();
      url.pathname = "/account";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
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

  const signedRole = request.cookies.get("oak_role")?.value;
  const verifiedRole = signedRole ? verifyCookieValue(signedRole) : null;
  const role = verifiedRole && allowedRoles.includes(verifiedRole as Role) ? (verifiedRole as Role) : undefined;

  if (!role) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("denied", path);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/qr-code",
    "/programme",
    "/partners",
    "/checkin",
    "/attendance",
    "/admin-manage",
    "/admin-change-password",
    "/admin-login",
    "/account",
    "/account/manage-admins",
  ],
};
