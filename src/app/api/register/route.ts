import { db } from '@/lib/supabaseClient';
import { sessionHashes, writeParticipantCookie } from '@/lib/session';
import { newToken, secretMatches, tokenHash } from '@/lib/security';
import { registrationSchema } from '@/lib/validation';
import { api, body, json, HttpError, databaseError, rateLimit } from '@/lib/http';
import { sendConfirmation } from '@/lib/confirmation-email';
export const POST = api(async request => {
  const { staff_access_code, consent, ...input } = await body(request, registrationSchema);
  await rateLimit('registration', input.email, 5, 86400);
  if (['Coordination Team', 'OAK Staff'].includes(input.role) && !secretMatches(staff_access_code || '', process.env.STAFF_ACCESS_CODE)) throw new HttpError(403, 'A valid staff access code is required for this role.');
  const registration_id = 'OAK-2026-' + newToken().slice(0, 32).toUpperCase();
  const recovery_code = newToken();
  const sessionToken=newToken();
  const {data,error}=await db().rpc('register_participant',{
    payload:{...input,registration_id,qr_code_id:input.role==='Partner'?registration_id:null,consent},
    session_hash:tokenHash(sessionToken),recovery_hash:tokenHash(recovery_code),
    session_expires:new Date(Date.now()+14*86400*1000).toISOString(),old_session_hashes:await sessionHashes(),
  });
  if (error?.code === '23505') throw new HttpError(409, 'This email is already registered. Use your recovery code to sign in, or contact event staff.');
  databaseError(error);
  if (!data) throw new Error('Registration was not returned by the database.');
  await writeParticipantCookie(sessionToken);
  const email_status = await sendConfirmation(data, recovery_code);
  return json({ role: data.role, registration_id, recovery_code, email_status }, 201);
});
