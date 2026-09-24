'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CalendarDays, Globe, Grid2X2, ScanLine, UserRound, UserPlus, LogOut } from 'lucide-react';
import { requestJson, errorMessage } from '@/lib/client-api';
type User = { name: string; role: string; isAdmin: boolean; is_master?: boolean };
export default function Sidebar() {
  const pathname = usePathname(); const router = useRouter();
  const [user, setUser] = useState<User | null>(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { let active = true; fetch('/api/auth/me', { cache: 'no-store' }).then(r => r.json()).then(d => { if (active) setUser(d.user || null); }).catch(() => { if (active) setUser(null); }); return () => { active = false; }; }, [pathname]);
  const staff = user?.isAdmin || user?.role === 'Coordination Team';
  const nav = [
    { href: '/register', label: 'Register', icon: UserPlus },
    ...(!user ? [{ href: '/admin-login', label: 'Staff sign-in', icon: UserRound }] : []),
    ...(user?.role === 'Partner' && !user.isAdmin ? [{ href: '/qr-code', label: 'My QR Code', icon: ScanLine }] : []),
    ...(staff ? [{ href: '/checkin', label: 'Check In', icon: ScanLine }, { href: '/attendance', label: 'Attendance', icon: Grid2X2 }] : []),
    ...(user && (user.isAdmin || user.role !== 'Partner') ? [{ href: '/programme', label: 'Programme', icon: CalendarDays }] : []),
    ...(user ? [{ href: '/partners', label: 'Partners', icon: Globe }] : []),
    ...(user?.isAdmin ? [{ href: '/account', label: 'My Account', icon: UserRound }] : []),
  ];
  async function logout() { setBusy(true); setError(''); try { await requestJson('/api/auth/logout', {}); setUser(null); router.push('/register'); router.refresh(); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } }
  return <aside className="fixed bottom-0 left-0 z-40 w-full border-t border-slate-200 bg-white md:inset-y-0 md:w-[255px] md:border-r md:border-t-0">
    <Link href="/register" className="hidden border-b border-slate-100 p-6 md:block"><Image src="/logo-oak-foundation.png" alt="OAK Foundation" width={85} height={53} priority /><p className="mt-4 text-xs font-semibold uppercase tracking-wider">Partner Convening 2026</p></Link>
    <nav aria-label="Event navigation" className="flex overflow-x-auto p-2 md:block md:p-4">{nav.map(({href,label,icon:Icon}) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} className={`flex min-w-[70px] shrink-0 flex-col items-center gap-1 rounded-xl p-2 text-[10px] md:mb-1 md:flex-row md:gap-3 md:px-4 md:py-3 md:text-sm ${pathname === href ? 'bg-[#162E55] text-white' : 'text-slate-600'}`}><Icon size={18} /><span>{label}</span></Link>)}
      {user && <button disabled={busy} onClick={logout} className="flex shrink-0 flex-col items-center gap-1 p-2 text-[10px] md:flex-row md:gap-3 md:px-4 md:py-3 md:text-sm"><LogOut size={18}/>{busy ? 'Signing out...' : 'Sign out'}</button>}
    </nav>
    {error && <p role="alert" className="p-2 text-xs text-red-700">{error}</p>}
    <div className="hidden p-6 text-xs text-slate-500 md:block"><p>{user?.name || 'Welcome to the convening'}</p><p className="mt-2">9-11 November 2026<br/>Harare, Zimbabwe</p></div>
  </aside>;
}
