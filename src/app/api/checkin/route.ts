import { db } from '@/lib/supabaseClient';
import { getAuthorizedStaff } from '@/lib/session';
import { codeSchema } from '@/lib/validation';
import { eventDate } from '@/lib/security';
import { api, body, json, HttpError, databaseError } from '@/lib/http';
export const POST = api(async request => {
  const scanner = await getAuthorizedStaff();
  if (!scanner) throw new HttpError(403, 'Coordination Team access is required.');
  const { qr_code_id } = await body(request, codeSchema);
  const { data: participant, error } = await db().from('participants').select('id,first_name,last_name,organization,role').eq('qr_code_id', qr_code_id).eq('role', 'Partner').maybeSingle();
  databaseError(error); if (!participant) throw new HttpError(404, 'Partner pass not recognized.');
  const today = eventDate();
  const insert = await db().from('checkins').insert({ participant_id: participant.id, check_in_date: today, checked_in_by: scanner.type === 'admin' ? scanner.id : null }).select('check_in_time').single();
  const already = insert.error?.code === '23505';
  if (!already) databaseError(insert.error);
  let checkin = insert.data;
  if (already) {
    const existing = await db().from('checkins').select('check_in_time').eq('participant_id', participant.id).eq('check_in_date', today).single();
    databaseError(existing.error); checkin = existing.data;
  }
  const [registered, checked] = await Promise.all([
    db().from('participants').select('id', { count: 'exact', head: true }),
    db().from('checkins').select('id', { count: 'exact', head: true }).eq('check_in_date', today),
  ]);
  databaseError(registered.error); databaseError(checked.error);
  return json({ participant, already, check_in_time: checkin!.check_in_time, live_stats: { total_registered: registered.count, total_checked_in: checked.count } });
});
