"use client";

import { useState } from "react";
import { ScanLine, CheckCircle2, AlertCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const SIMULATED_ATTENDEES = [
  {
    initials: "MS",
    name: "Maria Schmidt",
    qrCodeId: "OAK-2026-7842-XKPH",
    role: "Partner",
  },
  {
    initials: "JO",
    name: "James Odhiambo",
    qrCodeId: "OAK-2026-1193-JWQA",
    role: "OAK Staff",
  },
  {
    initials: "AD",
    name: "Awa Diallo",
    qrCodeId: "OAK-2026-3310-ADGE",
    role: "Coordination Team",
  },
  {
    initials: "FZB",
    name: "Fatima Z. Benali",
    qrCodeId: "OAK-2026-5592-FWBN",
    role: "Partner",
  },
] as const;

export default function CheckIn() {
  const [manualCode, setManualCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [checkedInAttendee, setCheckedInAttendee] = useState<any>(null);
  const [stats, setStats] = useState({ total_registered: 0, total_checked_in: 0 });

  async function handleCheckIn(code: string) {
    if (!code) return;
    setStatus("loading");
    setMessage("");
    setCheckedInAttendee(null);

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_code_id: code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to check in");
      } else {
        setStatus("success");
        setMessage("Check-in successful!");
        setCheckedInAttendee(data.participant);
        if (data.live_stats) setStats(data.live_stats);
        setManualCode(""); // reset
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error occurred");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] pb-[80px] md:pb-0">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[672px] px-8 py-10 max-sm:px-4">
          <div className="w-full">
            <h1 className="m-0 font-chillax text-2xl font-bold leading-[32px] text-[#0E1726]">
              Event Check-In
            </h1>

            <p className="m-0 mt-1 font-inter text-sm font-normal leading-5 text-[#6B7590]">
              Scan an attendee QR code to check them in
            </p>
          </div>

          {/* Camera / scan viewfinder */}
          <div className="mt-5 w-full overflow-hidden rounded-3xl bg-[#0E1726] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div className="relative flex h-[608px] w-full items-center justify-center overflow-hidden p-8">
              {/* ambient glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="h-[212px] w-[212px] rounded-full"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(168,187,206,0.12) 0%, rgba(168,187,206,0) 70%)",
                  }}
                />
              </div>

              {status === "success" && checkedInAttendee ? (
                <div className="relative z-10 flex flex-col items-center rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm">
                  <CheckCircle2 className="mb-4 h-16 w-16 text-green-400" />
                  <h2 className="font-chillax text-2xl font-bold text-white">
                    {checkedInAttendee.first_name} {checkedInAttendee.last_name}
                  </h2>
                  <p className="mt-2 text-[#A8BBCE]">{checkedInAttendee.organization}</p>
                  <p className="mt-1 font-semibold text-green-300">{checkedInAttendee.role}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 rounded-full bg-white/10 px-6 py-2 text-white transition hover:bg-white/20"
                  >
                    Scan Next
                  </button>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center">
                  {/* viewfinder frame with corner brackets */}
                  <div className="relative flex h-[211px] w-[211px] items-center justify-center">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l border-t border-[#A8BBCE]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute right-0 top-0 h-8 w-8 rounded-tr-xl border-r border-t border-[#A8BBCE]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b border-l border-[#A8BBCE]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-br-xl border-b border-r border-[#A8BBCE]"
                    />

                    <ScanLine
                      className="h-12 w-12 text-[#A8BBCE]/50"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-6 whitespace-nowrap text-center font-inter text-[12px] leading-4 tracking-[0.3px] text-[#A8BBCE]/50">
                    Position QR code within the frame
                  </p>
                </div>
              )}
            </div>

            <div className="flex h-16 w-full items-center gap-3 border-t border-[#FFFFFF1A] p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFFFFF1A]">
                <ScanLine className="h-4 w-4 text-[#A8BBCE]" strokeWidth={1.5} aria-hidden="true" />
              </span>

              <p className="m-0 font-inter text-[12px] leading-4 text-[#A8BBCE]/[0.45]">
                Hold camera steady · Auto-scans in 1–2 seconds
              </p>
            </div>
          </div>

          {/* Simulate QR Scan */}
          <div className="mt-5 w-full rounded-3xl border border-[#1C2E5A1A] bg-white p-5 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <p className="m-0 font-inter text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
              Simulate QR Scan
            </p>

            <div className="mt-3 flex flex-col gap-2">
              {SIMULATED_ATTENDEES.map((attendee) => (
                <button
                  key={attendee.qrCodeId}
                  type="button"
                  onClick={() => handleCheckIn(attendee.qrCodeId)}
                  disabled={status === "loading"}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#1C2E5A1A] bg-[#F7F8FA] p-3 text-left transition hover:bg-[#EEF1F5] disabled:opacity-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#162E55] font-chillax text-xs font-bold text-white">
                    {attendee.initials}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-inter text-sm font-semibold text-[#0E1726]">
                      {attendee.name}
                    </span>
                    <span className="block truncate font-inter text-xs text-[#6B7590]">
                      {attendee.qrCodeId} · {attendee.role}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Code Entry */}
          <div className="mt-5 w-full rounded-3xl border border-[#1C2E5A1A] bg-white p-5 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <p className="m-0 font-inter text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
              Manual Code Entry
            </p>

            {status === "error" && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" /> {message}
              </div>
            )}

            <div className="mt-3 flex w-full gap-2 max-sm:flex-col">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="OAK-2026-XXXX-XXXX"
                className="flex-1 rounded-[14px] border border-transparent bg-[#EEF1F5] px-4 py-[14px] font-inter text-[15px] text-[#0E1726] outline-none placeholder:text-[#6B7590] focus:border-transparent focus:outline-none focus:ring-0"
              />

              <button
                type="button"
                onClick={() => handleCheckIn(manualCode.trim())}
                disabled={status === "loading" || !manualCode.trim()}
                className="w-[90px] rounded-2xl bg-[#162E55] font-chillax font-semibold text-white shadow-[0_4px_20px_0_#1C2E5A4D] transition hover:bg-[#1C3A6B] disabled:opacity-50"
              >
                {status === "loading" ? "..." : "Check"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}