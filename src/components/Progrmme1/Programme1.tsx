'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { requestJson, errorMessage } from '@/lib/client-api';
import type { EventSession, SessionNote } from '@/lib/types';
type Resource={id:string;name:string;available:boolean};
const photos=['Opening plenary session','Keynote speaker','Breakout group discussion','Roundtable discussion','Workshop in progress','Welcome reception dinner'];
export default function Programme() {
  const query=useSearchParams();
  const [selectedTab,setTab]=useState<string|null>(null); const tab=selectedTab??(query.get('tab')==='docs'?'docs':'schedule'); const [day,setDay]=useState('Day 1');
  const [sessions,setSessions]=useState<EventSession[]>([]); const [notes,setNotes]=useState<SessionNote[]>([]); const [resources,setResources]=useState<Resource[]>([]);
  const [loadErrors,setLoadErrors]=useState<string[]>([]); const [reload,setReload]=useState(0); const [notesReady,setNotesReady]=useState(false);
  const [sessionId,setSessionId]=useState(''); const [text,setText]=useState('');const [error,setError]=useState('');const [loading,setLoading]=useState(true); const [busy,setBusy]=useState(false);
  useEffect(()=>{
    let active=true;
    Promise.allSettled([
      requestJson<EventSession[]>('/api/sessions'),
      requestJson<SessionNote[]>('/api/notes'),
      requestJson<Resource[]>('/api/resources'),
    ]).then(([schedule,privateNotes,documents])=>{
      if(!active)return;
      const failures:string[]=[];
      if(schedule.status==='fulfilled')setSessions(schedule.value);
      else failures.push('Schedule: '+errorMessage(schedule.reason));
      if(privateNotes.status==='fulfilled'){setNotes(privateNotes.value);setNotesReady(true);}
      else {setNotesReady(false);failures.push('Notes: '+errorMessage(privateNotes.reason));}
      if(documents.status==='fulfilled')setResources(documents.value);
      else failures.push('Resources: '+errorMessage(documents.reason));
      setLoadErrors(failures);setLoading(false);
    });
    return()=>{active=false;};
  },[reload]);
  async function save(e:FormEvent){e.preventDefault();if(busy||loading||!notesReady)return;setBusy(true);setError('');try{const note=await requestJson<SessionNote>('/api/notes',{session_id:sessionId,note_text:text});setNotes(n=>[note,...n.filter(old=>old.session_id!==note.session_id)]);setText('');setSessionId('');}catch(e){setError(errorMessage(e));}finally{setBusy(false);}}
  async function download(id:string){try{const data=await requestJson<{url:string}>('/api/resources?id='+encodeURIComponent(id));window.location.assign(data.url);}catch(e){setError(errorMessage(e));}}
  return <main className="portal-page"><h1 className="text-2xl font-bold">Programme</h1><p className="mb-6 mt-2">OAK Partner Convening 2026</p><div className="mb-6 flex gap-3">{['schedule','docs'].map(t=><button key={t} className={'portal-button '+(tab===t?'':'secondary')} aria-pressed={tab===t} onClick={()=>setTab(t)}>{t==='schedule'?'Schedule':'Notes & resources'}</button>)}</div>{error&&<p role="alert" className="mb-4 text-red-700">{error}</p>}{loadErrors.length>0&&<div role="alert" className="mb-4 space-y-2 text-red-700">{loadErrors.map(message=><p key={message}>{message}</p>)}<button className="portal-button secondary" disabled={loading||busy} onClick={()=>{setLoading(true);setReload(n=>n+1);}}>Retry loading</button></div>}{loading&&<p role="status">Loading programme...</p>}
    {tab==='schedule'?<><div className="mb-5 grid grid-cols-3 gap-3">{['Day 1','Day 2','Day 3'].map((d,i)=><button key={d} onClick={()=>setDay(d)} aria-pressed={day===d} className={'portal-button '+(day===d?'':'secondary')}>{d}<span className="block text-xs">{9+i} November</span></button>)}</div><div className="space-y-4">{sessions.filter(s=>s.day===day).map(s=><details key={s.id} className="portal-card"><summary className="cursor-pointer"><span className="text-sm text-slate-500">{s.start_time}{s.end_time?' - '+s.end_time:''}</span><h2 className="mt-2 inline-block text-lg font-semibold">{s.title}</h2></summary><p className="mt-3">{s.description||'Further session details will be shared by the event team.'}</p><p className="mt-3 text-sm">{[s.speaker,s.venue].filter(Boolean).join(' - ')}</p><button className="portal-button secondary mt-4" disabled={busy||loading||!notesReady} onClick={()=>{setSessionId(s.id);setText(notes.find(n=>n.session_id===s.id)?.note_text||'');setTab('docs');}}>Write a private note</button></details>)}{!loading&&!loadErrors.some(e=>e.startsWith('Schedule:'))&&!sessions.some(s=>s.day===day)&&<p>No sessions have been published for this day.</p>}</div></>:<div className="space-y-6">
      <section className="portal-card"><h2 className="mb-4 text-xl font-semibold">My private session notes</h2><form onSubmit={save}><fieldset className="space-y-3" disabled={busy||loading||!notesReady}><label className="portal-field">Session<select className="portal-input" required value={sessionId} onChange={e=>{setSessionId(e.target.value);setText(notes.find(n=>n.session_id===e.target.value)?.note_text||'');}}><option value="">Select a session</option>{sessions.map(s=><option value={s.id} key={s.id}>{s.day} | {s.title}</option>)}</select></label><label className="portal-field">Note<textarea className="portal-input" required minLength={5} maxLength={3000} rows={5} value={text} onChange={e=>setText(e.target.value)}/></label><button className="portal-button" disabled={busy}>{busy?'Saving...':'Save note'}</button></fieldset></form><div className="mt-6 space-y-4">{notes.map(n=><article key={n.id} className="border-t border-slate-100 pt-4"><h3 className="font-semibold">{sessions.find(s=>s.id===n.session_id)?.title||'Session note'}</h3><p className="my-2 whitespace-pre-wrap">{n.note_text}</p><button className="portal-button secondary" disabled={busy||loading||!notesReady} onClick={()=>{setSessionId(n.session_id);setText(n.note_text);}}>Edit note</button></article>)}</div></section>
      <section className="portal-card"><h2 className="mb-4 text-xl font-semibold">Resources</h2>{!loading&&!loadErrors.some(e=>e.startsWith('Resources:'))&&resources.length===0&&<p>No resources have been published yet.</p>}{resources.map(r=><div className="flex items-center justify-between gap-4 border-t py-3" key={r.id}><span>{r.name}</span><button className="portal-button secondary" disabled={!r.available} onClick={()=>download(r.id)}>{r.available?'Download':'Not uploaded yet'}</button></div>)}</section>
      <section className="portal-card"><h2 className="mb-4 text-xl font-semibold">Reference photo gallery</h2><p className="mb-4 text-sm">Illustrative event images.</p><div className="grid grid-cols-2 gap-3">{photos.map(label=><a key={label} href={'/photo gallery/Image ('+label+').png'} target="_blank" rel="noreferrer"><Image src={'/photo gallery/Image ('+label+').png'} width={280} height={180} alt={label} className="h-36 w-full rounded-xl object-cover"/></a>)}</div></section>
    </div>}
  </main>;
}
