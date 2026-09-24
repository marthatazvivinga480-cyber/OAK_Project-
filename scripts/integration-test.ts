import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { createDatabase } from '../tests/database';
import { postgrest } from './test-postgrest';

async function main(){
 const sql=await createDatabase();
 const master='20000000-0000-4000-8000-000000000001';const session='30000000-0000-4000-8000-000000000001';
 await sql.query(`INSERT INTO admins(id,username,password_hash,is_master) VALUES($1,'master',$2,true)`,[master,await bcrypt.hash('Synthetic-password-2026',12)]);
 await sql.query(`INSERT INTO sessions(id,day,start_time,title) VALUES($1,'Day 1','09:00','Synthetic opening')`,[session]);
 await sql.query(`INSERT INTO partners(name,region) VALUES('Synthetic partner','Global')`);
 const backend=postgrest(sql);await new Promise<void>(resolve=>backend.listen(0,'127.0.0.1',resolve));
 const backendPort=(backend.address() as {port:number}).port;
 const probe=http.createServer();await new Promise<void>(resolve=>probe.listen(0,'127.0.0.1',resolve));const port=(probe.address() as {port:number}).port;await new Promise<void>(resolve=>probe.close(()=>resolve()));
 const base=`http://127.0.0.1:${port}`;
 const env:NodeJS.ProcessEnv={...process.env,NODE_ENV:'production',NEXT_TELEMETRY_DISABLED:'1',SUPABASE_URL:`http://127.0.0.1:${backendPort}`,SUPABASE_SERVICE_ROLE_KEY:'test-service-role',SUPABASE_SECRET_KEY:'',NEXT_PUBLIC_SUPABASE_URL:'',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'',STAFF_ACCESS_CODE:'synthetic-staff-invite',RESEND_API_KEY:'',EMAIL_FROM:''};
 const child=spawn(process.execPath,[path.resolve('node_modules/next/dist/bin/next'),'start','-H','127.0.0.1','-p',String(port)],{env,windowsHide:true,stdio:['ignore','pipe','pipe']});
 let log='';child.stdout.on('data',c=>log+=c);child.stderr.on('data',c=>log+=c);
 const call=(route:string,cookie='',body?:unknown,method=body===undefined?'GET':'POST')=>fetch(base+route,{method,redirect:'manual',headers:{...(cookie?{cookie}:{}),...(body===undefined?{}:{'content-type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
 const cookie=(r:Response)=>r.headers.getSetCookie().map(v=>v.split(';')[0]).filter(v=>/^oak_(admin|participant)_session=.+/.test(v)).join('; ');
 async function batch(n:number,action:(i:number)=>Promise<void>){let index=0;await Promise.all(Array.from({length:25},async()=>{while(index<n)await action(index++);}));}
 const results:string[]=[];
 const record=(text:string)=>{results.push(text);console.log('PASS: '+text);};
 try{
  let ready=false;for(let i=0;i<100;i++){try{await call('/favicon.ico');ready=true;break;}catch{}if(child.exitCode!==null)break;await new Promise(r=>setTimeout(r,300));}
  assert(ready,'Server failed to start: '+log);
  for(const route of ['/attendance','/programme','/partners','/partners/40000000-0000-4000-8000-000000000001','/account/manage-admins']){
   for(const forged of ['', 'oak_admin_id=fake; oak_is_master=true; oak_role=Presenter'])assert.equal((await call(route,forged)).status,307,route);
  }
  for(const route of ['/api/attendance','/api/partners','/api/sessions','/api/notes','/api/resources'])assert([401,403].includes((await call(route)).status),route);
  record('Protected pages, nested routes and APIs reject anonymous and forged legacy cookies');
  await batch(500,async i=>{const r=await call('/api/register','',{first_name:' ',last_name:'Test',organization:'Synthetic',email:'bad'+i,role:'Partner',consent:false});assert.equal(r.status,400);});
  assert.equal((await sql.query<{n:number}>('SELECT count(*)::integer n FROM participants')).rows[0].n,0);
  record('500 invalid registrations rejected at concurrency 25; zero rows inserted');
  const malformed=await fetch(base+'/api/register',{method:'POST',headers:{'content-type':'application/json'},body:'{bad'});assert.equal(malformed.status,400);
  const oversized=await fetch(base+'/api/register',{method:'POST',headers:{'content-type':'application/json'},body:'x'.repeat(20000)});assert.equal(oversized.status,413);
  const cross=await fetch(base+'/api/register',{method:'POST',headers:{'content-type':'application/json',origin:'https://other.test'},body:'{}'});assert.equal(cross.status,403);
  record('Malformed, oversized and cross-origin requests rejected');
  const users:{role:string;cookie:string;registration_id:string;recovery_code:string}[]=[];
  for(const [i,role] of ['Partner','OAK Staff','Coordination Team','Presenter','Observer'].entries()){
   const input={first_name:'Synthetic',last_name:String(i),organization:'Test',role,email:`synthetic${i}@example.test`,phone:'+263123',consent:true,accommodation_requirements:'Test room',staff_access_code:'synthetic-staff-invite'};
   const r=await call('/api/register','',input);assert.equal(r.status,201,await r.clone().text());const data=await r.json();assert.equal(data.role,role);users.push({...data,cookie:cookie(r)});
   const saved=await sql.query<{consent:boolean;accommodation_requirements:string;qr_code_id:string|null;recovery_token_hash:string}>('SELECT * FROM participants WHERE email=$1',[input.email]);
   assert.equal(saved.rows[0].consent,true);assert.equal(saved.rows[0].accommodation_requirements,'Test room');assert.equal(Boolean(saved.rows[0].qr_code_id),role==='Partner');assert.notEqual(saved.rows[0].recovery_token_hash,data.recovery_code);
   for(const page of ['/qr-code','/programme','/partners','/checkin','/attendance']){
    const allowed=page==='/qr-code'?role==='Partner':page==='/programme'?role!=='Partner':['/checkin','/attendance'].includes(page)?role==='Coordination Team':true;
    assert.equal((await call(page,cookie(r))).status,allowed?200:307,`${role}:${page}`);
   }
  }
  record('All five roles register with correct QR policy; 25 page access checks pass');
  const duplicate=await call('/api/register','',{first_name:'Test',last_name:'Test',organization:'Test',role:'Partner',email:'SYNTHETIC0@EXAMPLE.TEST',phone:'123',consent:true});assert.equal(duplicate.status,409);
  const noInvite=await call('/api/register','',{first_name:'Test',last_name:'Test',organization:'Test',role:'Coordination Team',email:'noinvite@example.test',phone:'123',consent:true});assert.equal(noInvite.status,403);
  const partner=users[0],coordinator=users[2],presenter=users[3],observer=users[4];
  assert.equal((await call('/api/notes',partner.cookie,{session_id:session,note_text:'Must be rejected'})).status,403);
  const note=await call('/api/notes',presenter.cookie,{session_id:session,note_text:'A private note from the presenter.'});assert.equal(note.status,200);
  assert.deepEqual(await (await call('/api/notes',observer.cookie)).json(),[]);
  await call('/api/notes',observer.cookie,{session_id:session,note_text:'Different private note.'});
  await call('/api/notes',presenter.cookie,{session_id:session,note_text:'Updated private note.'});
  const notes=await (await call('/api/notes',presenter.cookie)).json();assert.equal(notes.length,1);assert.equal(notes[0].note_text,'Updated private note.');
  record('Duplicate emails and missing staff invitations rejected; notes stay private and editable');
  const schedule=await call('/api/sessions',presenter.cookie);assert.equal(schedule.status,200);assert.equal((await schedule.json())[0].id,session);
  assert.equal((await call('/api/sessions',partner.cookie)).status,403);
  assert.equal((await call('/api/notes?session_id=invalid',presenter.cookie)).status,400);
  assert.equal((await call('/api/notes',presenter.cookie,{session_id:'30000000-0000-4000-8000-000000000099',note_text:'Missing session must fail.'})).status,404);
  const resources=await call('/api/resources',presenter.cookie);assert.equal(resources.status,200);assert.deepEqual(await resources.json(),[]);
  assert.equal((await call('/api/resources?id=missing',presenter.cookie)).status,404);
  assert.equal((await call('/programme2',presenter.cookie)).status,307);
  record('Programme schedule, private note validation, missing resources and legacy route redirect pass');
  const timestamps=new Set<string>();let already=0;
  await batch(100,async()=>{const r=await call('/api/checkin',coordinator.cookie,{qr_code_id:partner.registration_id});assert.equal(r.status,200,await r.clone().text());const data=await r.json();timestamps.add(data.check_in_time);if(data.already)already++;});
  assert.equal(already,99);assert.equal(timestamps.size,1);assert.equal((await sql.query<{n:number}>('SELECT count(*)::integer n FROM checkins')).rows[0].n,1);
  record('100 simultaneous scans: one PostgreSQL check-in, 99 idempotent repeats, original timestamp preserved');
  const pid=(await sql.query<{id:string}>('SELECT id FROM participants WHERE registration_id=$1',[partner.registration_id])).rows[0].id;
  await sql.query(`INSERT INTO checkins(participant_id,check_in_date) VALUES($1,'2026-11-09'),($1,'2026-11-10'),($1,'2026-11-11') ON CONFLICT DO NOTHING`,[pid]);
  const report=await (await call('/api/attendance?date=2026-11-09',coordinator.cookie)).json();assert.equal(report.stats.total_checked_in,1);assert.equal(report.stats.attendance_percentage,20);
  record('Daily attendance counts one person across three event days, not three people');
  const resume=await call('/api/resume','',{registration_id:partner.registration_id,recovery_code:partner.recovery_code});assert.equal(resume.status,200);const resumed=cookie(resume);
  assert.equal((await call('/api/auth/logout',resumed,{})).status,200);assert.equal((await call('/qr-code',resumed)).status,307);
  const stored=await sql.query<{token_hash:string}>('SELECT token_hash FROM auth_sessions');assert(stored.rows.every((r: { token_hash: string }) => !users.some(u => u.cookie.includes(r.token_hash))));
  record('Recovery sign-in works; copied session cookies fail after logout; only token hashes stored');
  const login=await call('/api/admin/login','',{username:'master',password:'Synthetic-password-2026'});assert.equal(login.status,200,await login.clone().text());const adminCookie=cookie(login);
  for(const page of ['/account','/account/manage-admins','/programme','/partners','/attendance'])assert.equal((await call(page,adminCookie)).status,200,page);
  const create=await call('/api/admin/manage',adminCookie,{username:'assistant',password:'Synthetic-helper-2026'});assert.equal(create.status,201);const helper=await create.json();
  const helperLogin=await call('/api/admin/login','',{username:'assistant',password:'Synthetic-helper-2026'});const helperCookie=cookie(helperLogin);
  assert.equal((await call('/api/admin/manage',helperCookie)).status,403);
  assert.equal((await call('/api/admin/manage/reset-password',adminCookie,{id:helper.id,new_password:'Synthetic-changed-2026'})).status,200);
  assert.equal((await call('/api/admin/me',helperCookie)).status,403);
  assert.equal((await call('/api/admin/manage',adminCookie,{id:master},'DELETE')).status,404);
  assert.equal((await call('/api/admin/manage',adminCookie,{id:helper.id},'DELETE')).status,200);
  assert.equal((await call('/api/admin/recover-participant',adminCookie,{registration_id:partner.registration_id,email:'synthetic0@example.test'})).status,200);
  assert.equal((await call('/qr-code',partner.cookie)).status,307);
  assert.equal((await call('/api/admin/change-password',adminCookie,{current_password:'Synthetic-password-2026',new_password:'Synthetic-updated-2026'})).status,200);
  assert.equal((await call('/api/admin/me',adminCookie)).status,403);
  record('Master permissions, admin reset/removal, participant recovery and password-change revocation pass');
  await sql.query(`UPDATE auth_sessions SET expires_at=now()-interval '1 second' WHERE participant_id=(SELECT id FROM participants WHERE role='Observer')`);
  assert.equal((await call('/api/notes',observer.cookie)).status,403);
  const invalids:number[]=[];for(let i=0;i<12;i++)invalids.push((await call('/api/admin/login','',{username:'nobody',password:'Wrong-password-2026'})).status);
  assert.equal(invalids.filter(s=>s===401).length,10);assert.equal(invalids.filter(s=>s===429).length,2);
  record('Expired sessions are rejected and persistent login rate limiting returns 429');
  await mkdir('test-results',{recursive:true});await writeFile('test-results/integration.json',JSON.stringify({testedAt:new Date().toISOString(),scope:'Production Next.js over HTTP with embedded PostgreSQL and local PostgREST adapter; no live services',results},null,2));
 }finally{child.kill();backend.closeAllConnections();await new Promise<void>(resolve=>backend.close(()=>resolve()));await sql.close();await mkdir('test-results',{recursive:true});await writeFile('test-results/server.log',log);}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
