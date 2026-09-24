import { Client } from 'pg';
import { readFile } from 'node:fs/promises';
async function main(){
 try{process.loadEnvFile('.env.local');}catch{/* Environment variables can also supply the connection. */}
 if(!process.env.SUPABASE_DB_URL)throw new Error('Set SUPABASE_DB_URL in .env.local. Never commit it.');
 if(!process.argv.includes('--apply')&&!process.argv.includes('--check'))throw new Error('Use --check to inspect or --apply to run the transactional migration.');
 const client=new Client({connectionString:process.env.SUPABASE_DB_URL,connectionTimeoutMillis:15000});
 try{
  await client.connect();
  if(process.argv.includes('--apply')){
   await client.query(await readFile('supabase/migrations/003_unified_backend.sql','utf8'));
   // Ask Supabase's API to refresh its schema metadata after adding functions/columns.
   await client.query("NOTIFY pgrst, 'reload schema'");
   console.log('Unified backend migration applied. Existing records preserved; old browser sessions must sign in again.');
  }
  const check=await client.query("SELECT to_regclass('public.auth_sessions') IS NOT NULL AS sessions_ready, to_regprocedure('public.register_participant(jsonb,text,text,timestamptz,text[])') IS NOT NULL AS registration_ready, to_regprocedure('public.attendance_report(date,text,text,text,text,integer)') IS NOT NULL AS attendance_ready");
  console.log(check.rows[0]);
 }catch(error){await client.query('ROLLBACK').catch(()=>{});throw error;}finally{await client.end();}
}
main().catch(error=>{console.error(error instanceof Error?error.message:'Database migration failed.');process.exitCode=1;});
