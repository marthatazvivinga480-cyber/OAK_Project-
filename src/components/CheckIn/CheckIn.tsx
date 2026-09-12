"use client";

import { useState } from "react";
import { ScanLine, CheckCircle2, AlertCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";

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
    <div className="flex min-h-[1394px] bg-[#F4F5F7] max-md:flex-col">
      <Sidebar />
      <main className="min-h-[1394px] min-w-0 flex-1 bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[672px] px-[32px] py-[40px] max-sm:px-[16px]">
          <div className="h-[56px] w-full">
            <h1 className="m-0 h-[32px] w-full font-chillax text-[24px] font-bold leading-[32px] tracking-[0px] text-[#0E1726]">
              Event Check-In
            </h1>
            <p className="m-0 h-[24px] w-full pt-[4px] font-inter text-[14px] font-normal leading-[20px] tracking-[0px] text-[#6B7590]">
              Scan an attendee QR code to check them in
            </p>
          </div>

          <div className="mt-[16px] h-[673px] w-full overflow-hidden rounded-[24px] bg-[#0E1726] shadow-md">
            <div className="relative h-[608px] w-full overflow-hidden flex flex-col items-center justify-center p-8">
              {status === "success" && checkedInAttendee ? (
                <div className="bg-white/10 p-6 rounded-2xl flex flex-col items-center text-center backdrop-blur-sm border border-white/20">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
                  <h2 className="text-2xl text-white font-chillax font-bold">{checkedInAttendee.first_name} {checkedInAttendee.last_name}</h2>
                  <p className="text-[#A8BBCE] mt-2">{checkedInAttendee.organization}</p>
                  <p className="text-green-300 mt-1 font-semibold">{checkedInAttendee.role}</p>
                  <button onClick={() => setStatus("idle")} className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition">Scan Next</button>
                </div>
              ) : (
                <div className="relative">
                  <div className="h-[211px] w-[211px] border-2 border-[#A8BBCE] border-dashed rounded-3xl opacity-50 flex items-center justify-center">
                    <ScanLine className="w-12 h-12 text-[#A8BBCE]/50" />
                  </div>
                  <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center text-[12px] text-[#A8BBCE]/50 whitespace-nowrap">
                    Scanner coming soon. Use manual entry below.
                  </p>
                </div>
              )}
            </div>
            <div className="flex h-[65px] w-full items-center gap-[12px] border-t border-[#FFFFFF1A] p-[16px]">
              <p className="m-0 text-[#A8BBCE] text-sm">
                Stats: {stats.total_checked_in} / {stats.total_registered} checked in today
              </p>
            </div>
          </div>

          <div className="mt-[16px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[20px] shadow-sm">
            <p className="m-0 font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
              Manual Code Entry
            </p>
            {status === "error" && (
               <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" /> {message}
               </div>
            )}
            <div className="mt-[12px] flex w-full gap-[8px] max-sm:flex-col">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="OAK-2026-XXXX-XXXX"
                className="flex-1 rounded-[14px] border border-[#1C2E5A1A] bg-[#EEF1F5] px-[16px] py-[14px] font-inter text-[15px] text-[#0E1726] outline-none placeholder:text-[#6B7590] focus:border-[#162E55]"
              />
              <button
                type="button"
                onClick={() => handleCheckIn(manualCode.trim())}
                disabled={status === "loading" || !manualCode.trim()}
                className="w-[90px] rounded-[16px] bg-[#162E55] text-white font-chillax font-semibold shadow-md transition hover:bg-[#1C3A6B] disabled:opacity-50"
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
