import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
export async function createDatabase(legacy = false) {
  const db = new PGlite();
  await db.exec('CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;');
  if (legacy) {
    await db.exec(`CREATE TABLE public.partners(id text primary key, data jsonb);
      CREATE TABLE public.sessions(id text primary key, data jsonb);
      CREATE TABLE public.registrations(id uuid primary key,code text,email text,data jsonb,created_at timestamptz default now(),checked_in_at timestamptz);
      CREATE TABLE public.notes(id text primary key,data jsonb);`);
    await db.query(`INSERT INTO public.partners VALUES ('org',$1)`, [JSON.stringify({name:'Legacy organisation', website:'example.test', tags:['Learning'], since:2020, region:'Global'})]);
    await db.query(`INSERT INTO public.sessions VALUES ('opening',$1)`, [JSON.stringify({title:'Opening',day:1,time:'09:00',end:'10:00'})]);
    await db.query(`INSERT INTO public.registrations(id,code,email,data,checked_in_at) VALUES ('10000000-0000-4000-8000-000000000001','OAK-2026-LEGACY01','legacy@example.test',$1,'2026-11-09T08:00:00Z')`, [JSON.stringify({firstName:'Legacy',lastName:'Person',organisation:'Test',role:'Partner',phone:'123',consent:true})]);
    await db.query(`INSERT INTO public.notes VALUES ('note',$1)`, [JSON.stringify({ownerId:'10000000-0000-4000-8000-000000000001',sessionId:'opening',text:'A preserved private note.'})]);
  }
  await db.exec(await readFile('supabase/migrations/003_unified_backend.sql', 'utf8'));
  return db;
}
