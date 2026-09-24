import { NextResponse, type NextRequest } from 'next/server';
import { viewerFromTokens, ADMIN_COOKIE, PARTICIPANT_COOKIE } from '@/lib/session';
export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  try {
    const { admin, participant } = await viewerFromTokens(request.cookies.get(ADMIN_COOKIE)?.value, request.cookies.get(PARTICIPANT_COOKIE)?.value);
    const role = participant?.role;
    let allowed = false;
    if (path.startsWith('/account/manage-admins') || path === '/admin-manage') allowed = !!admin?.is_master;
    else if (path.startsWith('/account') || path === '/admin-change-password') allowed = !!admin;
    else if (path.startsWith('/attendance') || path.startsWith('/checkin') || path.startsWith('/check-in')) allowed = !!admin || role === 'Coordination Team';
    else if (path === '/qr-code') allowed = role === 'Partner';
    else if (path.startsWith('/partners')) allowed = !!admin || !!participant;
    else if (path.startsWith('/programme')) allowed = !!admin || (!!role && role !== 'Partner');
    if (allowed) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = !admin && !participant ? (path.startsWith('/account') || path.startsWith('/admin-') || path.startsWith('/check') || path.startsWith('/attendance') ? '/admin-login' : '/register') : admin ? '/account' : role === 'Partner' ? '/qr-code' : '/programme';
    url.search = '';
    return NextResponse.redirect(url);
  } catch {
    return new NextResponse('Sign-in verification is temporarily unavailable. Please try again.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
export const config = { matcher: ['/qr-code', '/programme/:path*', '/programme2', '/partners/:path*', '/checkin/:path*', '/check-in/:path*', '/attendance/:path*', '/account/:path*', '/admin-manage', '/admin-change-password'] };
