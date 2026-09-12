"use client";

import { ScanLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import Sidebar from "@/components/Sidebar";

type AttendeeRole = "Partner" | "OAK Staff" | "Coordination Team" | "Presenter" | "Observer";

interface RecentScan {
  initials: string;
  name: string;
  code: string;
  role: AttendeeRole;
}

export default function EventCheckIn({
  onScan,
  recentScans = [],
}: {
  onScan: (code: string) => void;
  recentScans?: RecentScan[];
}) {
  const [manualCode, setManualCode] = useState("");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    scanner.render((decodedText) => onScan(decodedText), () => {});
    scannerRef.current = scanner;
    return () => { scannerRef.current?.clear().catch(() => {}); };
  }, [onScan]);

  function handleManualCheck() {
    const code = manualCode.trim();
    if (!code) return;
    onScan(code);
  }

  return (
    <main className="flex min-h-screen bg-[#F4F5F7]">
      <Sidebar />

      <section className="flex min-h-[1394px] min-w-0 flex-1 justify-center bg-[#F4F5F7]">
        <div className="w-full max-w-[672px] px-8 py-10">
          <div className="h-14 w-full">
            <h1 className="h-8 w-full font-chillax text-[24px] font-bold leading-8 tracking-normal text-[#0E1726]">
              Event Check-In
            </h1>
            <p className="h-6 w-full pt-1 font-[var(--font-inter)] text-[14px] font-normal leading-5 tracking-normal text-[#6B7590]">
              Scan an attendee QR code to check them in
            </p>
          </div>

          <div className="mt-4 h-[673px] w-full overflow-hidden rounded-[24px] bg-[#0E1726] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div className="relative h-[608px] w-full overflow-hidden bg-[#0E1726]">
              <div id="qr-reader" className="absolute inset-0 h-full w-full" />
              <p className="pointer-events-none absolute left-1/2 top-[572px] h-4 w-[203px] -translate-x-1/2 whitespace-nowrap text-center font-[var(--font-inter)] text-[12px] font-normal leading-4 tracking-[0.3px] text-[#A8BBCE]/50">
                Position QR code within the frame
              </p>
            </div>
            <div className="flex h-[65px] w-full items-center gap-3 border-t border-white/10 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                <ScanLine className="h-[14px] w-[14px] text-[#A8BBCE]" strokeWidth={1.31} aria-hidden="true" />
              </div>
              <p className="font-[var(--font-inter)] text-[12px] font-normal leading-4 tracking-normal text-[#A8BBCE]/45">
                Hold camera steady · Auto-scans in 1–2 seconds
              </p>
            </div>
          </div>

          {recentScans.length > 0 && (
            <div className="mt-4 w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-5 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
              <p className="h-[15px] w-full font-[var(--font-inter)] text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
                Recent Check-Ins
              </p>
              <div className="mt-3 w-full space-y-2">
                {recentScans.map((attendee) => (
                  <div key={attendee.code} className="flex h-[62px] w-full items-center gap-3 rounded-2xl border border-[#1C2E5A1A] bg-white p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#162E55] font-[var(--font-inter)] text-[12px] font-bold leading-4 text-white">
                      {attendee.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="h-5 font-[var(--font-inter)] text-[14px] font-medium leading-5 tracking-normal text-[#0E1726]">
                        {attendee.name}
                      </p>
                      <p className="h-[15px] font-mono text-[10px] font-normal leading-[15px] tracking-normal text-[#6B7590]">
                        {attendee.code}
                      </p>
                    </div>
                    <RoleBadge role={attendee.role} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 h-[121.5px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-5 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <p className="h-[15px] w-full font-[var(--font-inter)] text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
              Manual Code Entry
            </p>
            <div className="mt-3 flex h-[52.5px] w-full gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(event) => setManualCode(event.target.value)}
                placeholder="OAK-2026-XXXX-XXXX"
                className="h-[52.5px] flex-1 rounded-[14px] border border-[#1C2E5A1A] bg-[#EEF1F5] px-4 py-[14px] font-[var(--font-inter)] text-[15px] font-normal leading-[18px] text-[#0E1726] placeholder:text-[#6B7590] outline-none"
              />
              <button
                type="button"
                onClick={handleManualCheck}
                className="flex h-[52.5px] w-[90px] shrink-0 items-center justify-center rounded-2xl bg-[#162E55] px-5 py-[14px] font-chillax text-[16px] font-semibold leading-6 text-white shadow-[0_4px_20px_0_#1C2E5A4D]"
              >
                Check
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function RoleBadge({ role }: { role: AttendeeRole }) {
  if (role === "OAK Staff") {
    return (
      <div className="flex h-[27px] w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-[10px] py-1">
        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#10B981]" />
        <span className="whitespace-nowrap font-[var(--font-inter)] text-[11px] font-semibold leading-[16.5px] tracking-[0.22px] text-[#065F46]">
          OAK Staff
        </span>
      </div>
    );
  }
  if (role === "Coordination Team") {
    return (
      <div className="flex h-[27px] w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-[10px] py-1">
        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#F97316]" />
        <span className="whitespace-nowrap font-[var(--font-inter)] text-[11px] font-semibold leading-[16.5px] tracking-[0.22px] text-[#C2410C]">
          Coordination Team
        </span>
      </div>
    );
  }
  return (
    <div className="flex h-[27px] w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-[#C5CFDF] bg-[#EEF1F9] px-[10px] py-1">
      <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#1C2E5A]" />
      <span className="whitespace-nowrap font-[var(--font-inter)] text-[11px] font-semibold leading-[16.5px] tracking-[0.22px] text-[#1C2E5A]">
        {role}
      </span>
    </div>
  );
}
