import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PAGE_ACCESS, type Role } from "@/lib/types";
import { verifyCookieValue } from "@/lib/cookieSecurity";

const ADMIN_ONLY_PATHS = ["/checkin", "/attendance", "/admin-manage", "/admin-change-password"];

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAdminPath = ADMIN_ONLY_PATHS.some(p => path === p || path.startsWith(`${p}/`));

  if (isAdminPath) {
    const signedAdminId = request.cookies.get("oak_admin_id")?.value;
    const signedRegistrationId = request.cookies.get("oak_registration_id")?.value;
    const signedRole = request.cookies.get("oak_role")?.value;
    
    let hasAccess = false;
    
    if (signedAdminId && verifyCookieValue(signedAdminId)) {
      hasAccess = true;
    } else if (signedRegistrationId && verifyCookieValue(signedRegistrationId) && signedRole) {
      const role = verifyCookieValue(signedRole);
      if (role === "Coordination Team") {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin-login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Determine if path is protected by PAGE_ACCESS
  let requiredRoles: Role[] | undefined;
  for (const [key, roles] of Object.entries(PAGE_ACCESS)) {
    if (path === key || path.startsWith(`${key}/`)) {
      requiredRoles = roles;
      break;
    }
  }

  if (!requiredRoles) {
    return NextResponse.next();
  }

  const signedRole = request.cookies.get("oak_role")?.value;
  let role: Role | undefined;
  if (signedRole) {
    role = verifyCookieValue(signedRole) as Role | undefined;
  }

  if (!role || !requiredRoles.includes(role)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("denied", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/qr-code/:path*",
    "/programme/:path*",
    "/partners/:path*",
    "/checkin/:path*",
    "/attendance/:path*",
    "/admin-manage/:path*",
    "/admin-change-password/:path*",
  ],
};