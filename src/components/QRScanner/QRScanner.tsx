"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ScanLine, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Phone, Users } from "lucide-react";

type ScanResult =
  | { status: "idle" }
  | {
      status: "success";
      participant: { first_name: string; last_name: string; organization: string; role: string };
      check_in_time: string;
      live_stats: { total_registered: number; total_checked_in: number };
    }
  | { status: "error"; reason: string };

export default function QRScanner() {
  const [manualCode, setManualCode] = useState("");
  const [result, setResult] = useState<ScanResult>({ status: "idle" });
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const lastScannedRef = useRef<string | null>(null);

  async function submitCode(code: string) {
    if (lastScannedRef.current === code) return;
    lastScannedRef.current = code;

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_code_id: code }),
      });
      const body = await res.json();
      if (!res.ok) {
        setResult({ status: "error", reason: body.error || "QR Code Not Recognized" });
      } else {
        setResult({ status: "success", ...body });
      }
    } catch {
      setResult({ status: "error", reason: "Network error" });
    } finally {
      setTimeout(() => { lastScannedRef.current = null; }, 3000);
    }
  }

  useEffect(() => {
    if (result.status !== "idle") return;
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    scanner.render((decodedText) => submitCode(decodedText), () => {});
    scannerRef.current = scanner;
    return () => { scannerRef.current?.clear().catch(() => {}); };
  }, [result.status]);

  function resetScan() {
    setResult({ status: "idle" });
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-heading mb-1">Event Check-In</h1>
        <p className="text-sm text-text-muted">Scan an attendee QR code to check them in</p>
      </div>

      {result.status === "success" && (
        <div className="space-y-6">
          <div className="bg-success rounded-3xl p-8 flex items-center gap-6 shadow-sm">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0 border border-white/20">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Checked In Successfully</h2>
              <p className="text-sm text-emerald-50 font-medium">
                {new Date(result.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-3xl p-8 shadow-sm border border-border">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shrink-0">
                {result.participant.first_name[0]}{result.participant.last_name[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-heading mb-1">
                  {result.participant.first_name} {result.participant.last_name}
                </h3>
                <p className="text-sm text-text-muted mb-3">{result.participant.organization}</p>
                <span className="bg-input-bg text-xs font-bold text-text-body px-3 py-1.5 rounded-full border border-border">
                  {result.participant.role}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-3xl p-8 shadow-sm border border-border">
            <p className="text-xs font-bold tracking-widest uppercase text-text-muted mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Live Event Status
            </p>
            <p className="font-bold text-text-heading mb-1">
              {result.live_stats.total_checked_in} of {result.live_stats.total_registered} attendees checked in
            </p>
            <div className="h-2 w-full bg-input-bg rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${result.live_stats.total_registered === 0 ? 0 : Math.round((result.live_stats.total_checked_in / result.live_stats.total_registered) * 100)}%`,
                }}
              />
            </div>
          </div>

          <button
            onClick={resetScan}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-2"
          >
            <ScanLine className="w-5 h-5" /> Scan Next Attendee
          </button>
        </div>
      )}

      {result.status === "error" && (
        <div className="space-y-6">
          <div className="bg-error rounded-3xl p-8 flex items-center gap-6 shadow-sm">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Check-In Failed</h2>
              <p className="text-sm text-red-100">{result.reason}</p>
            </div>
          </div>

          <div className="bg-surface rounded-3xl p-8 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-error" />
              <h3 className="font-bold text-text-heading">What this could mean</h3>
            </div>
            <ul className="space-y-3 text-sm text-text-body">
              <li>• The code doesn&apos;t match any registered attendee</li>
              <li>• The QR code may have expired (valid for 24 hours)</li>
              <li>• This attendee may already be checked in today</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetScan}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Try Again
            </button>
            <button className="w-full bg-surface hover:bg-input-bg border border-border text-text-heading font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2">
              <Phone className="w-5 h-5 text-text-muted" /> Contact Coordination Team
            </button>
          </div>
        </div>
      )}

      {result.status === "idle" && (
        <div className="space-y-6">
          <div className="bg-[#111827] rounded-3xl overflow-hidden p-4">
            <div id="qr-reader" />
          </div>

          <div className="bg-surface rounded-3xl p-6 shadow-sm border border-border">
            <p className="text-xs font-bold tracking-widest uppercase text-text-muted mb-4">
              Manual Code Entry
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); if (manualCode.trim()) submitCode(manualCode.trim()); }}
              className="flex gap-3"
            >
              <input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="OAK-2026-XXXX-XXXX"
                className="flex-1 bg-input-bg border border-border rounded-xl px-5 py-4 text-sm font-mono uppercase"
              />
              <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-xl">
                Check
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}