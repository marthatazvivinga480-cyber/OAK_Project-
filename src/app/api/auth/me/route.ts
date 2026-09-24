import { api, json } from '@/lib/http';
import { getViewer } from '@/lib/session';
export const GET = api(async () => {
  const { admin, participant } = await getViewer();
  if (admin) return json({ user: { id: admin.id, name: admin.username, role: 'Coordination Team', isAdmin: true, is_master: admin.is_master } });
  if (participant) return json({ user: { id: participant.id, name: `${participant.first_name} ${participant.last_name}`, role: participant.role, isAdmin: false } });
  return json({ user: null }, 401);
});
