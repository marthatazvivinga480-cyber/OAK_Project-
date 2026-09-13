"use client";

import Link from "next/link";
import { CheckCircle2, Download, RotateCcw } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import type { Participant } from "@/lib/types";
import Sidebar from "@/components/Sidebar";

export default function QRCodeDisplay({ participant }: { participant: Participant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firstName = participant.first_name;
  const attendee = {
    qrCodeId: participant.qr_code_id ?? "",
    userName: `${participant.first_name} ${participant.last_name}`,
    organisation: participant.organization,
    role: participant.role,
    email: participant.email,
    eventDates: "9–11 November 2026",
    location: "Harare, Zimbabwe",
  };

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${participant.registration_id}.png`;
    link.click();
  }

  const detailRows: Array<[string, string]> = [
    ["Name", attendee.userName],
    ["Organisation", attendee.organisation],
    ["Role", attendee.role],
    ["Email", attendee.email],
    ["Event Dates", attendee.eventDates],
    ["Location", attendee.location],
  ];

  return (
    <main className="flex min-h-screen bg-[#F4F5F7]">
      <Sidebar />

      <section className="flex w-full justify-center px-8 py-10 max-md:px-4 max-md:py-6">
        <div className="w-full max-w-[608px]">
          {/* Hero */}
          <header className="relative flex min-h-[151px] w-full items-center overflow-hidden rounded-3xl bg-[#162E55] px-6 py-6 text-white shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(168,187,206,0.25)_0%,rgba(168,187,206,0)_70%)]"
            />

            <div className="relative z-10 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/[0.15]">
                <CheckCircle2 className="h-6 w-6" strokeWidth={1.7} />
              </span>

              <div>
                <p className="font-inter text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-white/60">
                  Registration Complete
                </p>

                <h2 className="mt-1 font-chillax text-2xl font-bold leading-[30px]">
                  You&apos;re Registered,
                  <br />
                  {firstName}!
                </h2>

                <p className="mt-1 font-inter text-sm font-normal leading-5 text-white/60">
                  {attendee.organisation}
                </p>
              </div>
            </div>
          </header>

          {/* Entry pass */}
          <section className="mt-4 flex w-full flex-col items-center rounded-3xl border border-[#1C2E5A1A] bg-white p-6 text-center shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <p className="font-inter text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
              Your Entry Pass
            </p>

            <div className="mt-5 inline-block rounded-3xl bg-[#EEF1F5] p-4">
              <QRCodeCanvas
                ref={canvasRef}
                value={attendee.qrCodeId}
                size={198}
                level="H"
                marginSize={0}
              />
            </div>

            <p className="mt-3 font-[Consolas,monospace] text-[12px] leading-4 tracking-[2.16px] text-[#6B7590]">
              {attendee.qrCodeId}
            </p>

            <p className="mt-1 font-inter text-[12px] font-normal leading-4 text-[#6B7590]">
              Present at event entrance for check-in
            </p>
          </section>

          {/* Registration details */}
          <section className="mt-4 w-full rounded-3xl border border-[#1C2E5A1A] bg-white p-5 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <p className="font-inter text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
              Registration Details
            </p>

            <dl className="mt-3">
              {detailRows.map(([label, value], index) => (
                <div
                  key={label}
                  className={`flex items-center justify-between py-2 ${
                    index < detailRows.length - 1
                      ? "border-b border-[#1C2E5A1A]"
                      : ""
                  }`}
                >
                  <dt className="font-inter text-sm font-normal leading-5 text-[#6B7590]">
                    {label}
                  </dt>

                  <dd className="m-0 truncate text-right font-inter text-sm font-medium leading-5 text-[#0E1726]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Actions */}
          <div className="mt-4 flex w-full flex-col">
            <button
              type="button"
              onClick={handleDownload}
              className="flex h-14 w-full items-center justify-center gap-[10px] rounded-2xl bg-[#162E55] py-4 text-white shadow-[0_4px_20px_0_#1C2E5A4D] outline-none focus:outline-none focus:ring-0"
            >
              <Download className="h-[18px] w-[18px]" aria-hidden="true" />

              <span className="font-chillax text-base font-semibold leading-6 text-white">
                Download QR Code
              </span>
            </button>

            <Link
              href="/register"
              className="flex h-[54px] w-full items-center justify-center gap-[6px] pb-3 pt-[22px] text-center no-underline"
            >
              <RotateCcw
                className="h-[13px] w-[13px] text-[#6B7590]"
                aria-hidden="true"
              />

              <span className="font-inter text-sm font-normal leading-5 text-[#6B7590]">
                Register another attendee
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}