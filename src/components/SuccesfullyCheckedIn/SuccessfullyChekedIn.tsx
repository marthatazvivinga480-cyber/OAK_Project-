"use client";

import {
  Check,
  Clock3,
  MapPin,
  ScanLine,
  UserRound,
  UsersRound,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";

export default function CheckInSuccess() {
  return (
    <div className="flex min-h-[941px] bg-[#F4F5F7]">
      <Sidebar />

      <main className="min-h-[941px] min-w-0 flex-1 bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[672px] px-[32px] pt-[40px]">
          <div className="relative h-[107px] w-full overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#059669_0%,#10B981_100%)] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[496px] top-[-32px] h-[144px] w-[144px] rounded-full bg-[#FFFFFF1A]"
            />

            <div className="absolute left-[20px] top-1/2 flex -translate-y-1/2 items-center gap-[16px]">
              <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[16px] bg-[#FFFFFF33]">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-[2.5px] border-white">
                  <Check
                    className="h-[16px] w-[16px] text-white"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div>
                <p className="m-0 h-[30px] pt-[2px] font-chillax text-[20px] font-bold leading-[28px] tracking-[0px] text-white">
                  Checked In Successfully
                </p>

                <div className="flex h-[20px] items-center gap-[4px]">
                  <Clock3
                    className="h-[11px] w-[11px] shrink-0 text-white/60"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  <p className="m-0 h-[20px] font-inter text-[14px] font-normal leading-[20px] tracking-[0px] text-white/60">
                    09:34 · 9 March 2026
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[16px] h-[217px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[20px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div className="flex h-[79px] w-full gap-[16px]">
              <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[16px] bg-[#162E55]">
                <span className="font-chillax text-[18px] font-bold leading-[28px] tracking-[0px] text-white">
                  MS
                </span>
              </div>

              <div className="h-[79px] w-[174px]">
                <p className="m-0 h-[23px] font-chillax text-[18px] font-bold leading-[22.5px] tracking-[0px] text-[#0E1726]">
                  Maria Schmidt
                </p>

                <p className="m-0 h-[22px] whitespace-nowrap pt-[2px] font-inter text-[14px] font-normal leading-[20px] tracking-[0px] text-[#6B7590]">
                  Open Society Foundations
                </p>

                <div className="relative h-[28px] w-[174px]">
                  <div className="absolute left-0 top-[1px] flex h-[27px] w-[74px] items-center justify-center gap-[4px] rounded-full border border-[#C5CFDF] bg-[#EEF1F9] px-[10px] py-[4px]">
                    <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#1C2E5A]" />

                    <span className="whitespace-nowrap font-inter text-[11px] font-semibold leading-[16.5px] tracking-[0.22px] text-[#1C2E5A]">
                      Partner
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid h-[80px] w-full grid-cols-2 gap-[10px] border-t border-[#1C2E5A1A] pt-[17px]">
              <div className="h-[63px] w-full rounded-[16px] bg-[#EEF1F5] p-[12px]">
                <div className="flex h-[15px] items-center gap-[4px]">
                  <UserRound
                    className="h-[10px] w-[10px] shrink-0 text-[#6B7590]"
                    strokeWidth={0.83}
                    aria-hidden="true"
                  />

                  <span className="font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
                    Next Session
                  </span>
                </div>

                <p className="m-0 h-[24px] pt-[4px] font-inter text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#0E1726]">
                  Opening Plenary
                </p>
              </div>

              <div className="h-[63px] w-full rounded-[16px] bg-[#EEF1F5] p-[12px]">
                <div className="flex h-[15px] items-center gap-[4px]">
                  <MapPin
                    className="h-[10px] w-[10px] shrink-0 text-[#6B7590]"
                    strokeWidth={1}
                    aria-hidden="true"
                  />

                  <span className="font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
                    Venue
                  </span>
                </div>

                <p className="m-0 h-[24px] pt-[4px] font-inter text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#0E1726]">
                  Main Hall A
                </p>
              </div>
            </div>
          </div>

          <div className="mt-[16px] h-[131px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[20px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div className="flex h-[15px] w-full items-center gap-[4px]">
              <UsersRound
                className="h-[10px] w-[10px] shrink-0 text-[#6B7590]"
                strokeWidth={1.2}
                aria-hidden="true"
              />

              <p className="m-0 font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
                Live Event Status
              </p>
            </div>

            <div className="mt-[8px] flex h-[20px] items-center gap-[8px]">
              <span className="h-[8px] w-[8px] shrink-0 rounded-full bg-[#00BC7D] shadow-[0_0_0_4px_#10B9812E]" />

              <p className="m-0 font-inter text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#0E1726]">
                Opening Plenary starting at 09:30
              </p>
            </div>

            <p className="m-0 h-[24px] pt-[8px] font-inter text-[12px] font-normal leading-[16px] tracking-[0px] text-[#6B7590]">
              74 of 110 attendees checked in · Main Hall A
            </p>

            <div className="h-[18px] w-full pt-[12px]">
              <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#E5E8EE]">
                <div className="h-[6px] w-[379px] rounded-full bg-[linear-gradient(90deg,#1C2E5A_0%,#2D4A82_100%)]" />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-[24px] flex h-[56px] w-full items-center justify-center gap-[8px] rounded-[16px] bg-[#162E55] py-[16px] font-chillax text-[16px] font-semibold leading-[24px] tracking-[0px] text-white shadow-[0_4px_20px_0_#1C2E5A4D]"
          >
            <ScanLine
              className="h-[18px] w-[18px] shrink-0"
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <span className="whitespace-nowrap">
              Scan Next Attendee
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}