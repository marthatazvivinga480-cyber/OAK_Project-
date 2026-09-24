'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
import { requestJson,errorMessage } from '@/lib/client-api';
import type { Partner } from '@/lib/types';
function website(value:string|null){try{if(!value)return null;const url=new URL(/^https?:\/\//i.test(value)?value:'https://'+value);return ['https:','http:'].includes(url.protocol)?url.href:null;}catch{return null;}}
export default function PartnerDetail({id}:{id:string}){
 const [partner,setPartner]=useState<Partner|null>(null);const [error,setError]=useState('');
 useEffect(()=>{let active=true;requestJson<Partner>('/api/partners?id='+encodeURIComponent(id)).then(p=>{if(active)setPartner(p);}).catch(e=>{if(active)setError(errorMessage(e));});return()=>{active=false;};},[id]);
 return <main className="portal-page"><Link href="/partners" className="mb-6 inline-block underline">Back to partners</Link>{error&&<p role="alert" className="text-red-700">{error}</p>}{!partner&&!error&&<p role="status">Loading partner...</p>}{partner&&<article className="portal-card space-y-4"><h1 className="text-2xl font-bold">{partner.name}</h1>{partner.region&&<p>{partner.region}</p>}<p className="whitespace-pre-wrap">{partner.description||'Further information will be shared by the event team.'}</p>{partner.areas_of_work&&<p><strong>Areas of work: </strong>{partner.areas_of_work}</p>}{website(partner.website_url)&&<a className="block underline" href={website(partner.website_url)!} target="_blank" rel="noreferrer">Visit website</a>}{partner.contact_name&&<p>Contact: {partner.contact_name}</p>}{partner.contact_email&&<a className="block break-all underline" href={'mailto:'+partner.contact_email}>{partner.contact_email}</a>}</article>}</main>;
}
