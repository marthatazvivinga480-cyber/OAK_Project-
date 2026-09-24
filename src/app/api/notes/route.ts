import { z } from 'zod';
import { db } from '@/lib/supabaseClient';
import { requireProgramme } from '@/lib/session';
import { noteSchema } from '@/lib/validation';
import { api, body, json, HttpError, databaseError } from '@/lib/http';
export const GET = api(async request => {
  const { admin, participant } = await requireProgramme();
  const owner = admin ? 'admin_id' : 'participant_id';
  let query = db().from('session_notes').select('id,session_id,note_text,updated_at').eq(owner, (admin || participant)!.id).order('updated_at', { ascending: false });
  const id = new URL(request.url).searchParams.get('session_id');
  if (id) { if (!z.uuid().safeParse(id).success) throw new HttpError(400, 'Invalid session ID.'); query = query.eq('session_id', id); }
  const { data, error } = await query; databaseError(error); return json(data);
});
export const POST = api(async request => {
  const { admin, participant } = await requireProgramme();
  const input = await body(request, noteSchema);
  const owner = admin ? 'admin_id' : 'participant_id';
  const { data, error } = await db().from('session_notes').upsert({ ...input, [owner]: (admin || participant)!.id, updated_at: new Date().toISOString() }, { onConflict: `session_id,${owner}` }).select('id,session_id,note_text,updated_at').single();
  if (error?.code === '23503') throw new HttpError(404, 'Session not found.');
  databaseError(error); return json(data);
});
