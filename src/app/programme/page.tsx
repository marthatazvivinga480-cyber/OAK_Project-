import { Suspense } from 'react';
import Programme from '@/components/Progrmme1/Programme1';
export default function Page(){return <Suspense fallback={<p className="portal-page">Loading programme...</p>}><Programme/></Suspense>;}
