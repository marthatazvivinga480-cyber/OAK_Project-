import { api, json } from '@/lib/http';
import { requireAdmin } from '@/lib/session';
export const GET = api(async () => json(await requireAdmin()));
