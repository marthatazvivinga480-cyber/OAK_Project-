"use client";

import Link from "next/link";
import { ScanLine, UsersRound } from "lucide-react";

import Sidebar from "@/components/Sidebar";

export default function Attendance() {
  return (
    <div className="flex min-h-[941px] bg-[#F4F5F7]">
      <Sidebar />

      <main className="min-h-[941px] min-w-0 flex-1 bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[672px] px-[32px] pt-[40px]">
          <header className="h-[54px] w-full">
            <h1 className="m-0 h-[32px] w-full font-chillax text-[24px] font-bold leading-[32px] tracking-[0px] text-[#0E1726]">
              Attendance
            </h1>

            <p className="m-0 h-[22px] w-full pt-[2px] font-inter text-[14px] font-normal leading-[20px] tracking-[0px] text-[#6B7590]">
              Check-in tracking · 9–11 March 2026
            </p>
          </header>

          <div className="h-[356px] w-full pt-[24px]">
            <section className="flex h-[332px] w-full flex-col items-center justify-center gap-[16px] rounded-[24px] border border-[#1C2E5A1A] bg-white p-[40px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
              <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-[24px] bg-[#EEF1F5]">
                <UsersRound
                  className="h-[36px] w-[36px] text-[#A8BBCE]"
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
              </div>

              <div className="flex flex-col items-center text-center">
                <h2 className="m-0 font-chillax text-[18px] font-bold leading-[28px] tracking-[0px] text-[#0E1726]">
                  No check-ins yet
                </h2>

                <p className="m-0 max-w-[320px] pt-[4px] font-inter text-[14px] font-normal leading-[22.75px] tracking-[0px] text-[#6B7590]">
                  Attendees will appear here once they have been scanned in at
                  the event entrance.
                </p>
              </div>

              <div className="h-[60px] w-[262px] shrink-0 pt-[8px]">
                <Link
                  href="/checkin"
                  className="flex h-[52px] w-full items-center justify-center gap-[8px] rounded-[16px] bg-[linear-gradient(135deg,#1C2E5A_0%,#2D4A82_100%)] px-[24px] py-[14px] no-underline shadow-[0_4px_20px_0_#1C2E5A4D]"
                >
                  <ScanLine
                    className="h-[16px] w-[16px] shrink-0 text-white"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  <span className="whitespace-nowrap font-chillax text-[16px] font-semibold leading-[24px] tracking-[0px] text-white">
                    Go to Check-In Scanner
                  </span>
                </Link>
              </div>
            </section>
          </div>

          <div className="h-[158px] w-full pt-[16px]">
            <section className="h-[142px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[20px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
              <p className="m-0 h-[15px] w-full font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
                Event Overview
              </p>

              <div className="h-[85px] w-full pt-[12px]">
                <div className="grid h-[73px] w-full grid-cols-3 gap-[12px]">
                  <OverviewCard
                    value="110"
                    label="Expected"
                    valueClassName="text-[#0E1726]"
                  />

                  <OverviewCard
                    value="0"
                    label="Checked In"
                    valueClassName="text-[#1C2E5A]"
                  />

                  <OverviewCard
                    value="110"
                    label="Pending"
                    valueClassName="text-[#6B7590]"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function OverviewCard({
  value,
  label,
  valueClassName,
}: {
  value: string;
  label: string;
  valueClassName: string;
}) {
  return (
    <div className="flex h-[73px] min-w-0 flex-col items-center justify-center rounded-[16px] bg-[#EEF1F5] p-[12px]">
      <p
        className={`m-0 h-[32px] w-full text-center font-chillax text-[24px] font-bold leading-[32px] tracking-[0px] ${valueClassName}`}
      >
        {value}
      </p>

      <p className="m-0 h-[17px] w-full pt-[2px] text-center font-inter text-[10px] font-normal leading-[15px] tracking-[0px] text-[#6B7590]">
        {label}
      </p>
    </div>
  );
}