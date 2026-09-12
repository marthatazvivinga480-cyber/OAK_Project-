"use client";

import Link from "next/link";
import {
  CircleX,
  Phone,
  RefreshCcw,
  TriangleAlert,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";

const reasons = [
  "QR code belongs to a different event",
  "Registration was not completed",
  "Code has been altered or corrupted",
  "Attendee registered under a different email",
];

export default function CheckInFailed() {
  function handleContactTeam() {
    console.log("Contact coordination team");
  }

  return (
    <div className="flex min-h-[941px] bg-[#F4F5F7]">
      <Sidebar />

      <main className="min-h-[941px] min-w-0 flex-1 bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[672px] px-[32px] pt-[40px]">
          <div className="relative h-[105px] w-full overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#DC2626_0%,#EF4444_100%)] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div className="pointer-events-none absolute left-[496px] top-[-32px] h-[144px] w-[144px] rounded-full bg-[#FFFFFF1A]" />

            <div className="absolute left-[20px] top-[20px] flex h-[65px] w-[568px] items-center gap-[16px]">
              <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[16px] bg-[#FFFFFF33]">
                <CircleX
                  className="h-[30px] w-[30px] text-white"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </div>

              <div className="w-[202px]">
                <p className="m-0 h-[15px] font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-white/60">
                  Check-In Failed
                </p>

                <p className="m-0 h-[30px] pt-[2px] font-chillax text-[20px] font-bold leading-[28px] tracking-[0px] text-white">
                  QR Not Recognised
                </p>

                <p className="m-0 h-[20px] whitespace-nowrap font-inter text-[14px] font-normal leading-[20px] tracking-[0px] text-white/60">
                  Code is invalid or unregistered
                </p>
              </div>
            </div>
          </div>

          <div className="mt-[16px] h-[184px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[20px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div className="flex h-[20px] items-center gap-[8px]">
              <TriangleAlert
                className="h-[15px] w-[15px] shrink-0 text-[#EF4444]"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <p className="m-0 font-inter text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#0E1726]">
                Possible reasons
              </p>
            </div>

            <div className="mt-[8px]">
              {reasons.map((reason, index) => (
                <div
                  key={reason}
                  className={`flex h-[20px] items-center gap-[10px] ${
                    index === 0 ? "" : "mt-[10px]"
                  }`}
                >
                  <div className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full bg-[#FFE2E2]">
                    <span className="h-[6px] w-[6px] rounded-full bg-[#EF4444]" />
                  </div>

                  <p className="m-0 font-inter text-[14px] font-normal leading-[20px] tracking-[0px] text-[#6B7590]">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/checkin"
            className="mt-[16px] flex min-h-[56px] w-full items-center justify-center gap-[8px] rounded-[16px] bg-[#162E55] px-4 py-[16px] text-center font-chillax text-[16px] font-semibold leading-[24px] tracking-[0px] text-white shadow-[0_4px_20px_0_#1C2E5A4D] transition-colors hover:bg-[#1C3D6E] active:bg-[#102440] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#162E55]"
          >
            <RefreshCcw
              className="h-[17px] w-[17px] shrink-0 text-white"
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <span>Try Again</span>
          </Link>

          <button
            type="button"
            onClick={handleContactTeam}
            className="mt-[12px] flex h-[54px] w-full items-center justify-center gap-[8px] rounded-[24px] border border-[#1C2E5A1A] bg-white py-[16px] font-inter text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#0E1726] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]"
          >
            <Phone
              className="h-[15px] w-[15px] shrink-0 text-[#0E1726]"
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <span>Contact Coordination Team</span>
          </button>
        </div>
      </main>
    </div>
  );
}
