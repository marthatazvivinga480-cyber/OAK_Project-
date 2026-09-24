import { NextResponse } from 'next/server';
import type { z } from 'zod';
import { db } from './supabaseClient';
import { tokenHash } from './security';
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
}
export function api(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        const origin = request.headers.get('origin');
        let allowedOrigin = !origin;
        if (origin) { try { allowedOrigin = new URL(origin).origin === new URL(request.url).origin; } catch { allowedOrigin = false; } }
        if (request.headers.get('sec-fetch-site') === 'cross-site' || !allowedOrigin) throw new HttpError(403, 'Request origin is not allowed.');
        if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new HttpError(415, 'Send JSON with Content-Type application/json.');
      }
      return await handler(request);
    } catch (error) {
      if (error instanceof HttpError) return json({ error: error.message }, error.status);
      console.error('Event API request failed:', error instanceof Error ? error.message : 'database operation failed');
      return json({ error: 'The service is temporarily unavailable. Please try again.' }, 503);
    }
  };
}
export async function body<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  const max = 16384;
  if (Number(request.headers.get('content-length')) > max) throw new HttpError(413, 'Request is too large.');
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'JSON body is required.');
  let length = 0; const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > max) { await reader.cancel(); throw new HttpError(413, 'Request is too large.'); }
    chunks.push(value);
  }
  let input: unknown;
  try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new HttpError(400, 'Invalid JSON.'); }
  const result = schema.safeParse(input);
  if (!result.success) throw new HttpError(400, result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; '));
  return result.data;
}
export function databaseError(error: { code?: string; message?: string } | null) {
  if (error) throw new Error(`Database operation failed (${error.code || 'unknown'}).`);
}
export async function rateLimit(scope: string, identity: string, limit = 10, seconds = 900) {
  const { data, error } = await db().rpc('take_rate_limit', { bucket: tokenHash(`${scope}:${identity.toLowerCase()}`), max_hits: limit, window_seconds: seconds });
  databaseError(error);
  if (!data) throw new HttpError(429, 'Too many attempts. Please try again later.');
}
