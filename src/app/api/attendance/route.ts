import { z } from 'zod';
import { db } from '@/lib/supabaseClient';
import { getAuthorizedStaff } from '@/lib/session';
import { roles } from '@/lib/validation';
import { eventDate } from '@/lib/security';
import { api, json, HttpError, databaseError } from '@/lib/http';
const filters = z.object({ date: z.iso.date().optional(), name: z.string().max(160).default(''), organization: z.string().max(160).default(''), role: z.enum(roles).optional(), status: z.enum(['pending', 'checked_in']).optional(), page: z.coerce.number().int().min(1).max(100000).default(1) });
export const GET = api(async request => {
  if (!(await getAuthorizedStaff())) throw new HttpError(403, 'Coordination Team access is required.');
  const parsed = filters.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) throw new HttpError(400, 'Invalid attendance filters.');
  const input = parsed.data;
  const { data, error } = await db().rpc('attendance_report', { event_day: input.date || eventDate(), search_name: input.name, search_org: input.organization, filter_role: input.role || null, filter_status: input.status || null, page_number: input.page });
  databaseError(error); return json(data);
});
