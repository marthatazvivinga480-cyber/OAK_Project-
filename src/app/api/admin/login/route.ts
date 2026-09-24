import bcrypt from 'bcryptjs';
import { db } from '@/lib/supabaseClient';
import { createSession } from '@/lib/session';
import { loginSchema } from '@/lib/validation';
import { api, body, json, HttpError, databaseError, rateLimit } from '@/lib/http';
export const POST = api(async request => {
  const input = await body(request, loginSchema);
  await rateLimit('login', input.username);
  const { data, error } = await db().from('admins').select('id,password_hash,is_master,credential_version').eq('username', input.username).maybeSingle();
  databaseError(error);
  if (!data || !(await bcrypt.compare(input.password, data.password_hash))) throw new HttpError(401, 'Invalid username or password.');
  await createSession('admin', data.id, data.credential_version);
  return json({ is_master: data.is_master });
});
