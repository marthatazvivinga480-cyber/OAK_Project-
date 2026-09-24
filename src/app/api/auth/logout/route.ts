import { api, json } from '@/lib/http';
import { clearSessionCookies } from '@/lib/session';
export const POST = api(async () => { await clearSessionCookies(); return json({ success: true }); });
