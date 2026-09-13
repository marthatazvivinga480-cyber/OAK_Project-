"use client";

import Link from "next/link";
import { CheckCircle2, Download, RotateCcw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Sidebar from "@/components/Sidebar";

const attendee = {
  qrCodeId: "OAK-2026-7842-XKPH",
  userName: "Tinashe Smith",
  organisation: "uncommon.org",
  role: "Partner",
  email: "tinashe@uncommon.org",
  eventDates: "9-11 November 2026",
  location: "Harare, Zimbabwe",
};

export default function RegisterPage() {
  const firstName = attendee.userName.split(" ")[0];

  return (
    <main className="flex min-h-screen bg-[#f5f6f8] text-[#16243a] [font-family:Inter,Arial,sans-serif] max-md:flex-col">
      <Sidebar />

      <section className="mx-auto flex min-h-screen w-full max-w-[672px] flex-col px-8 py-10 max-md:px-4 max-md:py-6 max-[420px]:px-3 max-[420px]:py-4">
        <div className="mx-auto w-full max-w-[452px]">
          <header className="relative overflow-hidden rounded-2xl bg-[#162E55] px-6 py-5 text-white shadow-[0_4px_16px_rgba(28,46,90,0.07)]">
            <div className="relative z-10 flex items-start gap-3">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10">
                <CheckCircle2 className="size-5" strokeWidth={1.7} />
              </span>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-200">
                  Registration Complete
                </p>

                <h1 className="mt-1 text-2xl font-bold leading-7 tracking-tight">
                  You&apos;re Registered,
                  <br />
                  {firstName}!
                </h1>

                <p className="mt-1 text-xs text-white/55">
                  {attendee.organisation}
                </p>
              </div>
            </div>

            <div
              aria-hidden
              className="absolute -right-12 -top-14 size-52 rounded-full bg-[radial-gradient(circle,_rgba(113,154,213,.4),_transparent_65%)]"
            />
          </header>

          <section className="mt-3 rounded-2xl border border-[#e3e7ec] bg-white p-7 text-center shadow-[0_4px_16px_rgba(28,46,90,0.05)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B7590]">
              Your Entry Pass
            </p>

            <div className="mx-auto my-4 inline-block rounded-2xl border border-[#e3e7ec] bg-[#edf0f4] p-4 shadow-sm">
              <QRCodeSVG
                value={attendee.qrCodeId}
                size={166}
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#6B7590]">
              {attendee.qrCodeId}
            </p>

            <p className="mt-2 text-[11px] text-[#8993a3]">
              Present at event entrance for check-in
            </p>
          </section>

          <section className="mt-3 overflow-hidden rounded-2xl border border-[#e3e7ec] bg-white shadow-[0_4px_16px_rgba(28,46,90,0.05)]">
            <p className="px-6 pb-3 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B7590]">
              Registration Details
            </p>

            <dl>
              {[
                ["Name", attendee.userName],
                ["Organisation", attendee.organisation],
                ["Role", attendee.role],
                ["Email", attendee.email],
                ["Event Dates", attendee.eventDates],
                ["Location", attendee.location],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid min-h-10 grid-cols-[40%_60%] items-center border-t border-[#e3e7ec] px-6 text-xs"
                >
                  <dt className="text-[#6B7590]">{label}</dt>
                  <dd className="m-0 truncate text-right font-medium text-[#16243a]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <button
            type="button"
            onClick={() => window.print()}
            className="mt-3 flex min-h-[44px] w-full flex-row items-center justify-center gap-3 rounded-2xl bg-[#162E55] px-4 py-3 text-white shadow-[0_4px_16px_rgba(28,46,90,0.07)] transition hover:bg-[#1d3b6d] active:translate-y-px"
          >
            <Download className="size-4" />
            <span className="font-[Inter] text-center text-[14px] font-semibold leading-[20px] text-white">
              Download QR Code
            </span>
          </button>

          <Link
            href="/"
            className="mx-auto mt-4 flex w-fit items-center gap-1.5 text-xs text-[#6B7590] transition hover:text-[#162E55]"
          >
            <RotateCcw className="size-3.5" />
            Register another attendee
          </Link>
        </div>
      </section>
    </main>
  );
}