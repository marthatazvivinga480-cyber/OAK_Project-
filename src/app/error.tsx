'use client';
export default function ErrorPage({reset}:{error:Error;reset:()=>void}){return <main className="portal-page"><h1 className="mb-3 text-2xl font-bold">Unable to load this page</h1><p className="mb-5">Please try again. If this continues, contact the event team.</p><button className="portal-button" onClick={reset}>Try again</button></main>;}
