import { db } from '@/lib/supabaseClient';
import { requireProgramme } from '@/lib/session';
import { api, json, HttpError, databaseError } from '@/lib/http';
export const GET=api(async request=>{
  await requireProgramme();
  const id=new URL(request.url).searchParams.get('id');
  if(id){
    if(id.length>160)throw new HttpError(400,'Invalid resource ID.');
    const {data,error}=await db().from('resources').select('storage_path').eq('id',id).maybeSingle();databaseError(error);
    if(!data?.storage_path)throw new HttpError(404,'This resource has not been uploaded yet.');
    const result=await db().storage.from('event-resources').createSignedUrl(data.storage_path,60,{download:true});databaseError(result.error);
    return json({url:result.data!.signedUrl});
  }
  const {data,error}=await db().from('resources').select('id,name,storage_path').order('name');databaseError(error);
  return json(data!.map(r=>({id:r.id,name:r.name,available:!!r.storage_path})));
});
