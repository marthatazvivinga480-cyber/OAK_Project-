import bcrypt from 'bcryptjs';
import { db } from '@/lib/supabaseClient';
import { requireAdmin, clearSessionCookies } from '@/lib/session';
import { changeSchema } from '@/lib/validation';
import { api, body, json, HttpError, databaseError, rateLimit } from '@/lib/http';
export const POST = api(async request => {
  const admin = await requireAdmin();
  const input = await body(request, changeSchema);
  await rateLimit('password-change', admin.id);
  const { data, error } = await db().from('admins').select('password_hash').eq('id', admin.id).single();
  databaseError(error);
  if (!data) throw new HttpError(401, 'Administrator not found.');
  if (!(await bcrypt.compare(input.current_password, data.password_hash))) throw new HttpError(401, 'Current password is incorrect.');
  const update = await db().from('admins').update({ password_hash: await bcrypt.hash(input.new_password, 12) }).eq('id', admin.id).eq('password_hash', data.password_hash).select('id').maybeSingle();
  databaseError(update.error);
  if (!update.data) throw new HttpError(409, 'Password changed during this request. Sign in again.');
  await clearSessionCookies();
  return json({ success: true, sign_in_required: true });
});
