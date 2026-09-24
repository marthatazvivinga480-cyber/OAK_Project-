import { z } from 'zod';
import { db } from '@/lib/supabaseClient';
import { getViewer } from '@/lib/session';
import { api, json, HttpError, databaseError } from '@/lib/http';
export const GET = api(async request => {
  const { admin, participant } = await getViewer();
  if (!admin && !participant) throw new HttpError(401, 'Sign in to view partners.');
  const id = new URL(request.url).searchParams.get('id');
  let query = db().from('partners').select('id,name,logo_url,website_url,description,areas_of_work,contact_name,contact_email,region,partner_since');
  if (id) {
    if (!z.uuid().safeParse(id).success) throw new HttpError(400, 'Invalid partner ID.');
    const { data, error } = await query.eq('id', id).maybeSingle();
    databaseError(error); if (!data) throw new HttpError(404, 'Partner not found.');
    return json(data);
  }
  query = query.order('name');
  const { data, error } = await query;
  databaseError(error); return json(data);
});
