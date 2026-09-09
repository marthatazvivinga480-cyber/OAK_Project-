"use client";

import { useState } from "react";

type ScanResult =
  | { status: "idle" }
  | { status: "success"; participant: { first_name: string; last_name: string; organization: string; role: string }; check_in_time: string }
  | { status: "error"; reason: string };

export default function QRScanner() {
  const [manualCode, setManualCode] = useState("");
  const [result, setResult] = useState<ScanResult>({ status: "idle" });
  const [checking, setChecking] = useState(false);

  async function submitCode(code: string) {
    setChecking(true);
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
      setChecking(false);
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {}
      <div className="aspect-square bg-black text-white/60 rounded-lg flex items-center justify-center text-sm">
        Camera scanner goes here (not yet implemented)
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (manualCode.trim()) submitCode(manualCode.trim());
        }}
        className="flex gap-2"
      >
        <input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="OAK-2026-XXXX-XXXX"
          className="border rounded-md px-3 py-2 flex-1 font-mono text-sm"
        />
        <button
          type="submit"
          disabled={checking}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-md"
        >
          Check
        </button>
      </form>

      {result.status === "success" && (
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-green-700 font-medium mb-2">Participant Successfully Checked In</p>
          <p className="text-sm text-black">
            {result.participant.first_name} {result.participant.last_name} · {result.participant.organization} · {result.participant.role}
          </p>
          <p className="text-sm text-gray-700">{result.check_in_time}</p>
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