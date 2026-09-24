import bcrypt from 'bcryptjs';
import { db } from '../src/lib/supabaseClient';
import { adminSchema } from '../src/lib/validation';
async function main(){
try { process.loadEnvFile('.env.local'); } catch { /* Deployment variables can also supply credentials. */ }
const args=process.argv.slice(2);
const input=adminSchema.parse({username:args[args.indexOf('--username')+1],password:process.env.OAK_ADMIN_PASSWORD});
const existing=await db().from('admins').select('id',{count:'exact',head:true}).eq('is_master',true);
if(existing.error)throw new Error('Could not check existing administrators. Apply the migration first.');
if(existing.count)throw new Error('A master administrator already exists. Use account management to create additional accounts.');
const result=await db().from('admins').insert({username:input.username,password_hash:await bcrypt.hash(input.password,12),is_master:true});
if(result.error)throw new Error('Could not create administrator. Check the username and database setup.');
console.log('Master administrator created. Clear OAK_ADMIN_PASSWORD from your environment.');

}
main().catch(error=>{console.error(error instanceof Error?error.message:'Administrator setup failed');process.exitCode=1;});
