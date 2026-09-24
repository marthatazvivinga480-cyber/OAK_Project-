'use client';
import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import type { Participant } from '@/lib/types';
export default function QRCodeDisplay({participant}: {participant: Participant}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  function download() { if (!canvas.current) return; const link = document.createElement('a'); link.href = canvas.current.toDataURL('image/png'); link.download = `${participant.registration_id}.png`; link.click(); }
  return <main className="portal-page"><header className="mb-6"><h1 className="text-2xl font-bold">Your entry pass</h1><p>9-11 November 2026 | Harare, Zimbabwe</p></header><section className="portal-card space-y-5 text-center"><h2 className="text-xl font-semibold">{participant.first_name} {participant.last_name}</h2><p>{participant.organization}</p><QRCodeCanvas ref={canvas} value={participant.qr_code_id!} size={260} level="H" marginSize={4} className="mx-auto max-w-full"/><p className="break-all font-mono text-xs">{participant.registration_id}</p><p>Present this pass at the event entrance.</p><button className="portal-button" onClick={download}>Download QR code</button></section></main>;
}
