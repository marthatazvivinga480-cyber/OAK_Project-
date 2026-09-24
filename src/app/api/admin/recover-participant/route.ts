import {z} from 'zod';
import {requireAdmin} from '@/lib/session';
import {newToken,tokenHash} from '@/lib/security';
import {db} from '@/lib/supabaseClient';
import {api,body,json,databaseError,HttpError,rateLimit} from '@/lib/http';
export const POST=api(async request=>{
 const admin=await requireAdmin();await rateLimit('staff-recovery',admin.id,20);
 const input=await body(request,z.object({registration_id:z.string().trim().toUpperCase().min(1).max(100),email:z.email().max(254).transform(v=>v.toLowerCase())}));
 const recovery_code=newToken();
 const {data,error}=await db().from('participants').update({recovery_token_hash:tokenHash(recovery_code)}).eq('registration_id',input.registration_id).eq('email',input.email).select('id').maybeSingle();databaseError(error);
 if(!data)throw new HttpError(404,'Matching participant not found.');return json({recovery_code});
});
