import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PAGE_ACCESS, type Role } from "@/lib/types";
import { verifyCookieValue } from "@/lib/cookieSecurity";

const MASTER_ONLY_PATHS = ["/admin-manage", "/account/manage-admins"];
const ADMIN_ONLY_PATHS = [
  "/checkin",
  "/attendance",
  "/admin-change-password",
  "/account",
];

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const rawAdminCookie = request.cookies.get("oak_admin_id")?.value;
  const verifiedAdminId = rawAdminCookie
    ? verifyCookieValue(rawAdminCookie)
    : null;
  const hasAdminSession = Boolean(verifiedAdminId);

  const rawMasterCookie = request.cookies.get("oak_is_master")?.value;
  const verifiedMasterValue = rawMasterCookie
    ? verifyCookieValue(rawMasterCookie)
    : null;
  const isMaster = Boolean(
    hasAdminSession && verifiedMasterValue === "true"
  );

  if (isMaster) {
    return NextResponse.next();
  }

  if (
    MASTER_ONLY_PATHS.some(
      (p) => path === p || path.startsWith(p + "/")
    )
  ) {
    if (!hasAdminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin-login";
      return NextResponse.redirect(url);
    }

    const url = request.nextUrl.clone();
    url.pathname = "/account";
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

  if (!allowedRoles) {
    return NextResponse.next();
  }

  if (hasAdminSession) {
    return NextResponse.next();
  }

  const rawRoleCookie = request.cookies.get("oak_role")?.value;
  const verifiedRole = rawRoleCookie
    ? (verifyCookieValue(rawRoleCookie) as Role | null)
    : null;
  const role = (verifiedRole || rawRoleCookie) as Role | undefined;

  if (!role || !allowedRoles.includes(role)) {
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