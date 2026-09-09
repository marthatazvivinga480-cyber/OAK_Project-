"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

type ScanResult =
  | { status: "idle" }
  | { status: "success"; participant: { first_name: string; last_name: string; organization: string; role: string }; check_in_time: string }
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
        setResult({ status: "success", participant: body.participant, check_in_time: body.check_in_time });
      }
    } catch {
      setResult({ status: "error", reason: "Network error" });
    } finally {
      setTimeout(() => { lastScannedRef.current = null; }, 3000);
    }
  }

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    scanner.render(
      (decodedText) => submitCode(decodedText),
      () => {} // ignore per-frame "no code found" callbacks — expected, not an error
    );
    scannerRef.current = scanner;

    return () => {
      scannerRef.current?.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div id="qr-reader" />

      <form
        onSubmit={(e) => { e.preventDefault(); if (manualCode.trim()) submitCode(manualCode.trim()); }}
        className="flex gap-2"
      >
        <input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="OAK-2026-XXXX-XXXX"
          className="border rounded-md px-3 py-2 flex-1 font-mono text-sm"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md">
          Check
        </button>
      </form>

      {result.status === "success" && (
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-green-700 font-medium mb-2">Participant Successfully Checked In</p>
          <p className="text-sm text-black">
            {result.participant.first_name} {result.participant.last_name} · {result.participant.organization} · {result.participant.role}
          </p>
        </div>
      )}
      {result.status === "error" && (
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-red-600 font-medium mb-2">QR Code Not Recognized</p>
          <p className="text-sm text-black">{result.reason}</p>
        </div>
      )}
    </div>
  );
}