'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { requestJson, errorMessage } from '@/lib/client-api';
import type { Role } from '@/lib/types';
const roles: Role[] = ['Partner', 'OAK Staff', 'Coordination Team', 'Presenter', 'Observer'];
type Receipt = { registration_id: string; recovery_code: string; role: Role; email_status: string };
export default function RegistrationForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('Partner'); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [receipt, setReceipt] = useState<Receipt | null>(null); const [returning, setReturning] = useState(false);
  const destination = (value: Role) => value === 'Partner' ? '/qr-code' : value === 'Coordination Team' ? '/checkin' : '/programme';
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(busy)return; setBusy(true); setError('');
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (returning) { const data = await requestJson<{role: Role}>('/api/resume', fields); router.push(destination(data.role)); router.refresh(); }
      else { const data = await requestJson<Receipt>('/api/register', { ...fields, role, consent: fields.consent === 'on' }); setReceipt(data); }
    } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  }
  function downloadRecovery() {
    if (!receipt) return;
    const url = URL.createObjectURL(new Blob([`OAK Partner Convening 2026\nRegistration ID: ${receipt.registration_id}\nRecovery code: ${receipt.recovery_code}\nKeep this code private. Use it on the registration page to sign in again.`], { type: 'text/plain' }));
    const link = document.createElement('a'); link.href = url; link.download = 'OAK-registration-recovery.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (receipt) return <section className="portal-card space-y-4"><h2 className="text-2xl font-semibold">Registration complete</h2><p>Your role: {receipt.role}</p><p>Save your recovery code before continuing. It lets you sign in again on another device.</p><dl><dt className="font-semibold">Registration ID</dt><dd className="break-all">{receipt.registration_id}</dd><dt className="mt-3 font-semibold">Recovery code</dt><dd className="break-all font-mono text-sm">{receipt.recovery_code}</dd></dl><p className="text-sm">{receipt.email_status === 'sent' ? 'Your confirmation email has been sent.' : 'Email delivery is unavailable. Download your recovery details now.'}</p><button className="portal-button" onClick={downloadRecovery}>Download recovery details</button><Link className="portal-button block text-center" href={destination(receipt.role)}>Continue</Link></section>;
  return <section className="portal-card"><div className="mb-6 flex gap-3"><button className="portal-button" disabled={busy} aria-pressed={!returning} onClick={() => { setReturning(false); setError(''); }}>Register</button><button className="portal-button secondary" disabled={busy} aria-pressed={returning} onClick={() => { setReturning(true); setError(''); }}>Already registered?</button></div><h2 className="mb-5 text-xl font-semibold">{returning ? 'Sign in with your recovery code' : 'Event registration'}</h2>
    <form onSubmit={submit} className="space-y-4">{returning ? <><label className="portal-field">Registration ID<input className="portal-input" name="registration_id" required maxLength={100}/></label><label className="portal-field">Recovery code<input className="portal-input" name="recovery_code" type="password" required minLength={64} maxLength={64} autoComplete="off"/></label><p className="text-sm text-slate-600">Lost your code? Contact the coordination team for identity verification and a replacement.</p></> : <>
      <div className="grid gap-4 sm:grid-cols-2">{[['first_name','First name'],['last_name','Last name']].map(([name,label]) => <label className="portal-field" key={name}>{label}<input className="portal-input" name={name} required maxLength={160}/></label>)}</div>
      <label className="portal-field">Organisation<input className="portal-input" name="organization" required maxLength={160}/></label>
      <label className="portal-field">Programme area<input className="portal-input" name="sub_partner_program_area" maxLength={500}/></label>
      <label className="portal-field">Role<select className="portal-input" value={role} onChange={e => setRole(e.target.value as Role)}>{roles.map(r => <option key={r}>{r}</option>)}</select></label>
      {['OAK Staff','Coordination Team'].includes(role) && <label className="portal-field">Staff access code<input className="portal-input" name="staff_access_code" type="password" required maxLength={200} autoComplete="off"/><span className="text-xs font-normal">Use the code provided by the event administrator.</span></label>}
      <label className="portal-field">Email<input className="portal-input" name="email" type="email" required maxLength={254} autoComplete="email"/></label>
      <label className="portal-field">Phone<input className="portal-input" name="phone" type="tel" required maxLength={40} autoComplete="tel"/></label>
      {[["dietary_requirements","Dietary requirements"],["accessibility_requirements","Accessibility requirements"],["travel_requirements","Travel requirements"],["accommodation_requirements","Accommodation requirements"]].map(([name,label]) => <label className="portal-field" key={name}>{label}<textarea className="portal-input" name={name} maxLength={500} rows={2}/></label>)}
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="consent" required className="mt-1"/><span>I have read the <Link className="underline" href="/privacy" target="_blank">privacy notice</Link> and consent to my registration data being used for this event.</span></label>
    </>}{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button className="portal-button w-full" disabled={busy}>{busy ? 'Please wait...' : returning ? 'Sign in' : 'Complete registration'}</button></form></section>;
}
