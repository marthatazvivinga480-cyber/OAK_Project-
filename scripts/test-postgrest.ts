// Local-only test adapter. It executes the production SQL in embedded PostgreSQL;
// it is never imported by the application and never connects to Supabase.
import http from 'node:http';
import type { PGlite } from '@electric-sql/pglite';
const tables = new Set(['admins','participants','auth_sessions','checkins','sessions','session_notes','partners','resources','rate_limits']);
const quote = (value: string) => {
  if (!/^[a-z_]+$/.test(value)) throw new Error('Invalid test SQL identifier');
  return '"'+value+'"';
};
export function postgrest(database: PGlite) {
  return http.createServer(async (req, res) => {
    const send=(data:unknown,status=200,count?:number)=>{
      res.writeHead(status,{'content-type':'application/json',...(count===undefined?{}:{'content-range':`0-${Math.max(0,count-1)}/${count}`})});
      res.end(req.method==='HEAD'?'':JSON.stringify(data));
    };
    try {
      if(req.headers.apikey!=='test-service-role'){send({error:'Test key required'},401);return;}
      const url=new URL(req.url!,'http://localhost');
      const parts=url.pathname.split('/');const table=parts.at(-1)!;
      const chunks:Buffer[]=[];for await(const chunk of req)chunks.push(Buffer.from(chunk));
      const input=chunks.length?JSON.parse(Buffer.concat(chunks).toString()):{};
      if(url.pathname.startsWith('/rest/v1/rpc/')){
        const args:Record<string,string[]>={register_participant:['payload','session_hash','recovery_hash','session_expires','old_session_hashes'],take_rate_limit:['bucket','max_hits','window_seconds'],attendance_report:['event_day','search_name','search_org','filter_role','filter_status','page_number']};
        const keys=args[table];if(!keys){send({error:'Unknown test RPC'},404);return;}
        const result=await database.query<{value:unknown}>(`SELECT public.${quote(table)}(${keys.map((_,i)=>'$'+(i+1)).join(',')}) value`,keys.map(k=>input[k]));
        send(result.rows[0].value);return;
      }
      if(!tables.has(table)){send({error:'Unknown test table'},404);return;}
      const columns=url.searchParams.get('select')||'*';
      const selection=columns==='*'?'*':columns.split(',').map(quote).join(',');
      const params:unknown[]=[];
      const bind=(value:unknown)=>{params.push(value);return '$'+params.length;};
      const conditions:string[]=[];
      for(const [key,value] of url.searchParams){
        if(['select','order','limit','offset','on_conflict'].includes(key))continue;
        const field=quote(key);const split=value.indexOf('.');const op=value.slice(0,split);const val=value.slice(split+1);
        if(op==='eq')conditions.push(`${field}=${bind(val)}`);
        else if(op==='gt')conditions.push(`${field}>${bind(val)}`);
        else if(op==='in')conditions.push(`${field} IN (${val.slice(1,-1).split(',').map(v=>bind(v.replace(/^"|"$/g,''))).join(',')})`);
        else throw new Error('Unsupported test filter: '+op);
      }
      const where=conditions.length?' WHERE '+conditions.join(' AND '):'';
      const target='public.'+quote(table);
      let sql='';let count:number|undefined;
      if(req.method==='POST'){
        const keys=Object.keys(input);sql=`INSERT INTO ${target} (${keys.map(quote).join(',')}) VALUES (${keys.map(k=>bind(input[k])).join(',')})`;
        const conflict=url.searchParams.get('on_conflict');
        if(conflict)sql+=` ON CONFLICT (${conflict.split(',').map(quote).join(',')}) DO UPDATE SET ${keys.map(k=>`${quote(k)}=EXCLUDED.${quote(k)}`).join(',')}`;
        sql+=' RETURNING '+selection;
      }else if(req.method==='PATCH'){
        sql=`UPDATE ${target} SET ${Object.keys(input).map(k=>`${quote(k)}=${bind(input[k])}`).join(',')}${where} RETURNING ${selection}`;
      }else if(req.method==='DELETE')sql=`DELETE FROM ${target}${where} RETURNING ${selection}`;
      else{
        const counted=await database.query<{n:number}>(`SELECT count(*)::integer n FROM ${target}${where}`,params);count=counted.rows[0].n;
        sql=`SELECT ${selection} FROM ${target}${where}`;
        const order=url.searchParams.get('order');if(order)sql+=' ORDER BY '+order.split(',').map(v=>{const [col,dir]=v.split('.');return quote(col)+(dir==='desc'?' DESC':' ASC');}).join(',');
        sql+=` LIMIT ${bind(Number(url.searchParams.get('limit')||1000))} OFFSET ${bind(Number(url.searchParams.get('offset')||0))}`;
      }
      const result=await database.query(sql,params);
      const single=req.headers.accept?.includes('vnd.pgrst.object+json');
      if(single&&result.rows.length!==1){send({code:'PGRST116',details:`The result contains ${result.rows.length} rows`,message:'Expected one row'},406);return;}
      send(single?result.rows[0]:result.rows,req.method==='POST'?201:200,count);
    }catch(error){const e=error as {code?:string;message?:string};send({code:e.code||'TEST_ERROR',message:e.message},e.code==='23505'?409:400);}
  });
}
