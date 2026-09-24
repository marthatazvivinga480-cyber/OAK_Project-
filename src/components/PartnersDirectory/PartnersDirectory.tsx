'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
import { requestJson,errorMessage } from '@/lib/client-api';
import type { Partner } from '@/lib/types';
export default function PartnersDirectory(){
 const [partners,setPartners]=useState<Partner[]>([]);const [search,setSearch]=useState('');const [region,setRegion]=useState('');const [error,setError]=useState('');const [loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;requestJson<Partner[]>('/api/partners').then(d=>{if(active)setPartners(d);}).catch(e=>{if(active)setError(errorMessage(e));}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
 const regions=[...new Set(partners.map(p=>p.region).filter((r):r is string=>!!r))];
 const filtered=partners.filter(p=>(!region||p.region===region)&&`${p.name} ${p.areas_of_work||''} ${p.region||''}`.toLowerCase().includes(search.toLowerCase()));
 return <main className="portal-page"><h1 className="mb-6 text-2xl font-bold">Partners directory</h1><section className="portal-card mb-6 grid gap-4 sm:grid-cols-2"><label className="portal-field">Search partners<input className="portal-input" value={search} onChange={e=>setSearch(e.target.value)}/></label><label className="portal-field">Region<select className="portal-input" value={region} onChange={e=>setRegion(e.target.value)}><option value="">All regions</option>{regions.map(r=><option key={r}>{r}</option>)}</select></label></section>{error&&<p role="alert" className="text-red-700">{error}</p>}{loading&&<p role="status">Loading partners...</p>}<div className="space-y-4">{filtered.map(p=><Link href={'/partners/'+p.id} key={p.id} className="portal-card block"><h2 className="text-lg font-semibold">{p.name}</h2>{p.region&&<p className="mt-1 text-sm text-slate-500">{p.region}</p>}<p className="mt-3 text-sm">{p.areas_of_work}</p>{p.partner_since&&<p className="mt-2 text-xs">Partner since {p.partner_since}</p>}</Link>)}</div>{!loading&&!error&&!filtered.length&&<p>No partners match your search.</p>}</main>;
}
