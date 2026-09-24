import { cookies } from 'next/headers';
import { db } from './supabaseClient';
import { newToken, tokenHash, validToken } from './security';
import { databaseError, HttpError } from './http';
import type { Participant } from './types';
export const ADMIN_COOKIE = 'oak_admin_session';
export const PARTICIPANT_COOKIE = 'oak_participant_session';
const participantColumns = 'id,registration_id,first_name,last_name,organization,sub_partner_program_area,role,email,phone,dietary_requirements,accessibility_requirements,travel_requirements,accommodation_requirements,registration_status,registration_date,qr_code_id,created_at,credential_version';
export type Admin = { id: string; username: string; is_master: boolean };
export type Viewer = { admin: Admin | null; participant: Participant | null };
async function lookup(token: string | undefined, kind: 'admin' | 'participant') {
  if (!validToken(token)) return null;
  const { data, error } = await db().from('auth_sessions').select('admin_id,participant_id,expires_at,credential_version').eq('token_hash', tokenHash(token)).gt('expires_at', new Date().toISOString()).maybeSingle();
  databaseError(error);
  return data && data[`${kind}_id`] ? data : null;
}
export async function viewerFromTokens(adminToken?: string, participantToken?: string): Promise<Viewer> {
  const adminSession = await lookup(adminToken, 'admin');
  if (adminSession) {
    const { data, error } = await db().from('admins').select('id,username,is_master,credential_version').eq('id', adminSession.admin_id).maybeSingle();
    databaseError(error);
    if (data && data.credential_version === adminSession.credential_version) return { admin: { id: data.id, username: data.username, is_master: data.is_master }, participant: null };
  }
  const participantSession = await lookup(participantToken, 'participant');
  if (participantSession) {
    const { data, error } = await db().from('participants').select(participantColumns).eq('id', participantSession.participant_id).maybeSingle();
    databaseError(error);
    if (data && data.credential_version === participantSession.credential_version) { const { credential_version: _version, ...participant } = data; void _version; return { admin: null, participant: participant as Participant }; }
  }
  return { admin: null, participant: null };
}
export async function getViewer() {
  const jar = await cookies();
  return viewerFromTokens(jar.get(ADMIN_COOKIE)?.value, jar.get(PARTICIPANT_COOKIE)?.value);
}
export async function getCurrentAdmin() { return (await getViewer()).admin; }
export async function getCurrentParticipant() { return (await getViewer()).participant; }
export async function getAuthorizedStaff() {
  const { admin, participant } = await getViewer();
  if (admin) return { type: 'admin', id: admin.id, role: 'Coordination Team', is_master: admin.is_master };
  if (participant?.role === 'Coordination Team') return { type: 'participant', id: participant.id, role: participant.role };
  return null;
}
export async function requireAdmin(master = false) {
  const admin = await getCurrentAdmin();
  if (!admin || (master && !admin.is_master)) throw new HttpError(403, 'Administrator access is required.');
  return admin;
}
export async function requireProgramme() {
  const viewer = await getViewer();
  if (!viewer.admin && (!viewer.participant || viewer.participant.role === 'Partner')) throw new HttpError(403, 'Programme access is required.');
  return viewer;
}
export async function clearSessionCookies() {
  const jar = await cookies();
  const hashes = [ADMIN_COOKIE, PARTICIPANT_COOKIE].map(name => jar.get(name)?.value).filter(validToken).map(tokenHash);
  if (hashes.length) { const { error } = await db().from('auth_sessions').delete().in('token_hash', hashes); databaseError(error); }
  for (const name of [ADMIN_COOKIE, PARTICIPANT_COOKIE, 'oak_admin_id', 'oak_registration_id', 'oak_role', 'oak_is_master', 'oak-session']) jar.delete(name);
}
export async function createSession(kind: 'admin' | 'participant', id: string, credentialVersion: number | null = null) {
  await clearSessionCookies();
  if (credentialVersion === null) {
    const { data, error } = await db().from('participants').select('credential_version').eq('id', id).single();
    databaseError(error); if (!data) throw new HttpError(401, 'Participant not found.'); credentialVersion = data.credential_version;
  }
  const token = newToken();
  const seconds = kind === 'admin' ? 8 * 3600 : 14 * 86400;
  const { error } = await db().from('auth_sessions').insert({ token_hash: tokenHash(token), [`${kind}_id`]: id, credential_version: credentialVersion, expires_at: new Date(Date.now() + seconds * 1000).toISOString() });
  databaseError(error);
  (await cookies()).set(kind === 'admin' ? ADMIN_COOKIE : PARTICIPANT_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: seconds });
}

export async function sessionHashes() {
 const jar=await cookies();
 return [ADMIN_COOKIE,PARTICIPANT_COOKIE].map(name=>jar.get(name)?.value).filter(validToken).map(tokenHash);
}
export async function writeParticipantCookie(token:string) {
 const jar=await cookies();
 for(const name of [ADMIN_COOKIE,'oak_admin_id','oak_registration_id','oak_role','oak_is_master','oak-session'])jar.delete(name);
 jar.set(PARTICIPANT_COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:14*86400});
}
