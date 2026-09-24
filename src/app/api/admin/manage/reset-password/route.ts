import bcrypt from 'bcryptjs';
import { db } from '@/lib/supabaseClient';
import { requireAdmin } from '@/lib/session';
import { resetSchema } from '@/lib/validation';
import { api, body, json, HttpError, databaseError } from '@/lib/http';
export const POST = api(async request => {
  await requireAdmin(true);
  const input = await body(request, resetSchema);
  const { data, error } = await db().from('admins').update({ password_hash: await bcrypt.hash(input.new_password, 12) }).eq('id', input.id).eq('is_master', false).select('id').maybeSingle();
  databaseError(error);
  if (!data) throw new HttpError(404, 'Non-master administrator not found.');
  return json({ success: true });
});
