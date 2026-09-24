import bcrypt from 'bcryptjs';
import { db } from '@/lib/supabaseClient';
import { requireAdmin } from '@/lib/session';
import { adminSchema, idSchema } from '@/lib/validation';
import { api, body, json, HttpError, databaseError } from '@/lib/http';
export const GET = api(async () => {
  await requireAdmin(true);
  const { data, error } = await db().from('admins').select('id,username,is_master').order('username');
  databaseError(error); return json(data);
});
export const POST = api(async request => {
  await requireAdmin(true);
  const input = await body(request, adminSchema);
  const { data, error } = await db().from('admins').insert({ username: input.username, password_hash: await bcrypt.hash(input.password, 12), is_master: false }).select('id,username').single();
  if (error?.code === '23505') throw new HttpError(409, 'Username already exists.');
  databaseError(error); return json(data, 201);
});
export const DELETE = api(async request => {
  await requireAdmin(true);
  const { id } = await body(request, idSchema);
  const { data, error } = await db().from('admins').delete().eq('id', id).eq('is_master', false).select('id').maybeSingle();
  databaseError(error);
  if (!data) throw new HttpError(404, 'Non-master administrator not found.');
  return json({ deleted: id });
});
