import { db } from '@/lib/supabaseClient';
import { createSession } from '@/lib/session';
import { tokenHash } from '@/lib/security';
import { recoverySchema } from '@/lib/validation';
import { api, body, json, HttpError, databaseError, rateLimit } from '@/lib/http';
export const POST = api(async request => {
  const input = await body(request, recoverySchema);
  await rateLimit('recovery', input.registration_id);
  const { data, error } = await db().from('participants').select('id,role,credential_version').eq('registration_id', input.registration_id).eq('recovery_token_hash', tokenHash(input.recovery_code)).maybeSingle();
  databaseError(error);
  if (!data) throw new HttpError(401, 'Invalid registration ID or recovery code.');
  await createSession('participant', data.id, data.credential_version);
  return json({ role: data.role });
});
