import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createDatabase } from './database';

test('migration, real PostgreSQL constraints, pagination, session revocation and privileges', async () => {
 const db=await createDatabase();
 try {
  await db.exec(await readFile('supabase/migrations/003_unified_backend.sql','utf8'));
  const participant='10000000-0000-4000-8000-000000000001';
  const admin='20000000-0000-4000-8000-000000000001';
  await db.query(`INSERT INTO participants(id,registration_id,first_name,last_name,organization,role,email) VALUES($1,'OAK-2026-TEST0001','Test','Person','Test','Partner','test@example.test')`,[participant]);
  await db.query(`INSERT INTO admins(id,username,password_hash,is_master) VALUES($1,'master','hash-a',true)`,[admin]);
  const attempts=await Promise.allSettled(Array.from({length:100},()=>db.query(`INSERT INTO checkins(participant_id,check_in_date) VALUES($1,'2026-11-09')`,[participant])));
  assert.equal(attempts.filter(r=>r.status==='fulfilled').length,1);
  await db.query(`INSERT INTO checkins(participant_id,check_in_date) VALUES($1,'2026-11-10'),($1,'2026-11-11')`,[participant]);
  const report=await db.query<{report:{stats:{total_checked_in:number;attendance_percentage:number};participants:unknown[]}}>(`SELECT attendance_report('2026-11-09') AS report`);
  assert.equal(report.rows[0].report.stats.total_checked_in,1);
  assert.equal(report.rows[0].report.stats.attendance_percentage,100);
  await db.exec(`INSERT INTO participants(registration_id,first_name,last_name,organization,role,email) SELECT 'OAK-2026-'||n,'Person',n::text,'Other','Observer','person'||n||'@example.test' FROM generate_series(1,1100)n`);
  const last=await db.query<{report:{total:number;participants:{full_name:string}[]}}>(`SELECT attendance_report('2026-11-09','','',NULL,'pending',22) AS report`);
  assert.equal(last.rows[0].report.total,1100);assert.equal(last.rows[0].report.participants.length,50);
  const literal=await db.query<{report:{total:number}}>(`SELECT attendance_report('2026-11-09','%,role.eq.Partner') AS report`);
  assert.equal(literal.rows[0].report.total,0);
  await assert.rejects(db.query(`INSERT INTO participants(registration_id,first_name,last_name,organization,role,email) VALUES('OAK-2026-DUPLICATE','Test','Test','Test','Partner','TEST@EXAMPLE.TEST')`));
  await db.query(`INSERT INTO auth_sessions(token_hash,admin_id,credential_version,expires_at) VALUES($1,$2,0,now()+interval '1 day')`,['a'.repeat(64),admin]);
  await db.query(`UPDATE admins SET password_hash='hash-b' WHERE id=$1`,[admin]);
  assert.equal((await db.query<{n:number}>('SELECT count(*)::integer n FROM auth_sessions')).rows[0].n,0);
  assert.equal((await db.query<{v:number}>('SELECT credential_version v FROM admins')).rows[0].v,1);
  await db.query(`INSERT INTO auth_sessions(token_hash,participant_id,credential_version,expires_at) VALUES($1,$2,0,now()+interval '1 day')`,['b'.repeat(64),participant]);
  await db.query(`UPDATE participants SET recovery_token_hash=$1 WHERE id=$2`,['c'.repeat(64),participant]);
  assert.equal((await db.query<{n:number}>('SELECT count(*)::integer n FROM auth_sessions')).rows[0].n,0);
  const limits=await Promise.all(Array.from({length:25},()=>db.query<{allowed:boolean}>(`SELECT take_rate_limit('test-bucket',10,60) allowed`)));
  assert.equal(limits.filter(r=>r.rows[0].allowed).length,10);
  for(const role of ['anon','authenticated']) for(const table of ['admins','participants','checkins','sessions','session_notes','partners','auth_sessions','rate_limits','resources']) {
   const result=await db.query<{allowed:boolean}>(`SELECT has_table_privilege($1,$2,'SELECT') allowed`,[role,'public.'+table]);assert.equal(result.rows[0].allowed,false,`${role}:${table}`);
  }
  const privileges=await db.query<{allowed:boolean}>(`SELECT has_function_privilege('anon','public.attendance_report(date,text,text,text,text,integer)','EXECUTE') allowed`);
  assert.equal(privileges.rows[0].allowed,false);
  const payload={registration_id:'OAK-2026-ATOMIC001',first_name:'Atomic',last_name:'Test',organization:'Test',role:'Observer',email:'atomic@example.test',consent:true};
  // A failed session insert must roll back the participant insert as well.
  await assert.rejects(db.query(`SELECT register_participant($1::jsonb,'invalid-hash',$2,now()+interval '1 day',ARRAY[]::text[])`,[JSON.stringify(payload),'d'.repeat(64)]));
  assert.equal((await db.query<{n:number}>("SELECT count(*)::integer n FROM participants WHERE email='atomic@example.test'")).rows[0].n,0);
  await db.query(`SELECT register_participant($1::jsonb,$2,$3,now()+interval '1 day',ARRAY[]::text[])`,[JSON.stringify(payload),'e'.repeat(64),'d'.repeat(64)]);
  assert.equal((await db.query<{n:number}>("SELECT count(*)::integer n FROM participants WHERE email='atomic@example.test'")).rows[0].n,1);
 } finally {await db.close();}
});
test('legacy migration preserves partners, sessions, participants, check-ins and private notes',async()=>{
 const db=await createDatabase(true);
 try{
  for(const table of ['partners','sessions','participants','checkins','session_notes'])assert.equal((await db.query<{n:number}>(`SELECT count(*)::integer n FROM ${table}`)).rows[0].n,1,table);
  assert.equal((await db.query<{n:number}>('SELECT count(*)::integer n FROM oak_legacy.registrations')).rows[0].n,1);
  await db.exec(await readFile('supabase/migrations/003_unified_backend.sql','utf8'));
  assert.equal((await db.query<{n:number}>('SELECT count(*)::integer n FROM session_notes')).rows[0].n,1);
 }finally{await db.close();}
});
