import { db } from '@/lib/supabaseClient';
import { requireProgramme } from '@/lib/session';
import { api, json, databaseError } from '@/lib/http';
export const GET = api(async () => {
  await requireProgramme();
  const { data, error } = await db().from('sessions').select('*').order('day').order('start_time');
  databaseError(error); return json(data);
});
