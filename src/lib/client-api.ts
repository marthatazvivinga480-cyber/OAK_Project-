export async function requestJson<T>(url: string, body?: unknown, method = body === undefined ? 'GET' : 'POST'): Promise<T> {
  const response = await fetch(url, { method, headers: body === undefined ? undefined : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store' });
  let data;
  try { data = await response.json(); } catch { throw new Error('The service returned an unexpected response. Please try again.'); }
  if (!response.ok) throw new Error(data.error || 'Unable to complete your request.');
  return data as T;
}
export const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Unable to complete your request.';
