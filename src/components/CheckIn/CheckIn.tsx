import Link from "next/link";
import {
  Check,
  Clock,
  MapPin,
  ScanLine,
  UserRound,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";

export default function CheckInSuccessPage() {
  return (
    <main className="flex min-h-screen bg-[#F4F5F7]">
      {/* =====================================================
          SHARED SIDEBAR
      ====================================================== */}
      <Sidebar />

      {/* =====================================================
          CHECK-IN SUCCESS PAGE

          DO NOT CHANGE:
          max-width: 672px
          inner content: 608px
          horizontal padding: 32px
          top padding: 40px
          gap between sections: 16px
          background: #F4F5F7
      ====================================================== */}
      <section
        className="
          flex
          min-h-[941px]
          min-w-0
          flex-1
          justify-center
          bg-[#F4F5F7]
        "
      >
        <div
          className="
            flex
            w-full
            max-w-[672px]
            flex-col
            px-8
            pb-10
            pt-10
          "
        >
          {/* =================================================
              SUCCESS BANNER

              608 × 107
          ================================================== */}
          <div
            className="
              relative
              flex
              h-[107px]
              w-full
              items-center
              overflow-hidden
              rounded-[24px]
              bg-[linear-gradient(135deg,#059669_0%,#10B981_100%)]
              shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]
            "
          >
            {/* Decorative right circle */}
            <div
              className="
                pointer-events-none
                absolute
                right-[-32px]
                top-[-31px]
                h-[140px]
                w-[140px]
                rounded-full
                bg-white/[0.08]
              "
            />

            <div
              className="
                relative
                z-10
                flex
                items-center
                gap-4
                px-6
              "
            >
              {/* Check icon container */}
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/20
                "
              >
                <Check
                  className="
                    h-[30px]
                    w-[30px]
                    text-white
                  "
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>

              {/* Success text */}
              <div>
                <h1
                  className="
                    m-0
                    font-chillax
                    text-[20px]
                    font-bold
                    leading-7
                    tracking-normal
                    text-white
                  "
                >
                  Checked In Successfully
                </h1>

                <div
                  className="
                    flex
                    h-5
                    items-center
                    gap-1
                  "
                >
                  <Clock
                    className="
                      h-[11px]
                      w-[11px]
                      shrink-0
                      text-white/60
                    "
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  <p
                    className="
                      m-0
                      font-[var(--font-inter)]
                      text-[14px]
                      font-normal
                      leading-5
                      tracking-normal
                      text-white/60
                    "
                  >
                    09:34 · 9 March 2026
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              ATTENDEE DETAILS CARD

              16px gap
              608 × 217
          ================================================== */}
          <div
            className="
              mt-4
              h-[217px]
              w-full
              rounded-[24px]
              border
              border-[#1C2E5A1A]
              bg-white
              p-5
              shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]
            "
          >
            {/* Attendee top section */}
            <div
              className="
                flex
                h-[79px]
                w-full
                gap-4
              "
            >
              {/* Initials */}
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#162E55]
                "
              >
                <span
                  className="
                    font-chillax
                    text-[18px]
                    font-bold
                    leading-7
                    text-white
                  "
                >
                  MS
                </span>
              </div>

              {/* Name / organisation / role */}
              <div className="min-w-0 flex-1">
                <p
                  className="
                    h-[23px]
                    font-chillax
                    text-[18px]
                    font-bold
                    leading-[22.5px]
                    text-[#0E1726]
                  "
                >
                  Maria Schmidt
                </p>

                <p
                  className="
                    h-[22px]
                    pt-[2px]
                    font-[var(--font-inter)]
                    text-[14px]
                    font-normal
                    leading-5
                    text-[#6B7590]
                  "
                >
                  Open Society Foundations
                </p>

                {/* Partner badge */}
                <div
                  className="
                    mt-1
                    flex
                    h-[27px]
                    w-[74px]
                    items-center
                    justify-center
                    gap-1
                    rounded-full
                    border
                    border-[#C5CFDF]
                    bg-[#EEF1F9]
                    px-[10px]
                    py-1
                  "
                >
                  <span
                    className="
                      h-[6px]
                      w-[6px]
                      rounded-full
                      bg-[#1C2E5A]
                    "
                  />

                  <span
                    className="
                      font-[var(--font-inter)]
                      text-[11px]
                      font-semibold
                      leading-[16.5px]
                      tracking-[0.22px]
                      text-[#1C2E5A]
                    "
                  >
                    Partner
                  </span>
                </div>
              </div>
            </div>

            {/* Next session + venue */}
            <div
              className="
                grid
                h-20
                w-full
                grid-cols-2
                gap-[10px]
                border-t
                border-[#1C2E5A1A]
                pt-[17px]
              "
            >
              {/* Next session */}
              <div
                className="
                  h-[63px]
                  w-full
                  rounded-2xl
                  bg-[#EEF1F5]
                  p-3
                "
              >
                <div className="flex items-center gap-1">
                  <UserRound
                    className="
                      h-[10px]
                      w-[10px]
                      text-[#6B7590]
                    "
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  <span
                    className="
                      font-[var(--font-inter)]
                      text-[10px]
                      font-semibold
                      uppercase
                      leading-[15px]
                      tracking-[1px]
                      text-[#6B7590]
                    "
                  >
                    Next Session
                  </span>
                </div>

                <p
                  className="
                    pt-1
                    font-[var(--font-inter)]
                    text-[14px]
                    font-semibold
                    leading-5
                    text-[#0E1726]
                  "
                >
                  Opening Plenary
                </p>
              </div>

              {/* Venue */}
              <div
                className="
                  h-[63px]
                  w-full
                  rounded-2xl
                  bg-[#EEF1F5]
                  p-3
                "
              >
                <div className="flex items-center gap-1">
                  <MapPin
                    className="
                      h-[10px]
                      w-[10px]
                      text-[#6B7590]
                    "
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  <span
                    className="
                      font-[var(--font-inter)]
                      text-[10px]
                      font-semibold
                      uppercase
                      leading-[15px]
                      tracking-[1px]
                      text-[#6B7590]
                    "
                  >
                    Venue
                  </span>
                </div>

                <p
                  className="
                    pt-1
                    font-[var(--font-inter)]
                    text-[14px]
                    font-semibold
                    leading-5
                    text-[#0E1726]
                  "
                >
                  Main Hall A
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              LIVE EVENT STATUS

              16px gap
              608 × 131
          ================================================== */}
          <div
            className="
              mt-4
              h-[131px]
              w-full
              rounded-[24px]
              border
              border-[#1C2E5A1A]
              bg-white
              p-5
              shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]
            "
          >
            {/* Status label */}
            <div
              className="
                flex
                h-[15px]
                w-full
                items-center
                gap-1
              "
            >
              <span
                className="
                  h-2
                  w-2
                  shrink-0
                  rounded-full
                  bg-[#00BC7D]
                  shadow-[0_0_0_4px_#10B9812E]
                "
              />

              <span
                className="
                  font-[var(--font-inter)]
                  text-[10px]
                  font-semibold
                  uppercase
                  leading-[15px]
                  tracking-[1px]
                  text-[#6B7590]
                "
              >
                Live Event Status
              </span>
            </div>

            {/* Current event */}
            <p
              className="
                mt-[10px]
                font-[var(--font-inter)]
                text-[14px]
                font-semibold
                leading-5
                tracking-normal
                text-[#0E1726]
              "
            >
              Opening Plenary starting at 09:30
            </p>

            {/* Attendance */}
            <p
              className="
                mt-1
                font-[var(--font-inter)]
                text-[12px]
                font-normal
                leading-4
                tracking-normal
                text-[#6B7590]
              "
            >
              74 of 110 attendees checked in · Main Hall A
            </p>

            {/* Progress track */}
            <div
              className="
                mt-3
                h-[6px]
                w-full
                overflow-hidden
                rounded-full
                bg-[#E5E8EE]
              "
            >
              {/* 379px Figma progress */}
              <div
                className="
                  h-[6px]
                  w-[379px]
                  rounded-full
                  bg-[linear-gradient(90deg,#1C2E5A_0%,#2D4A82_100%)]
                "
              />
            </div>
          </div>

          {/* =================================================
              SCAN NEXT ATTENDEE

              16px gap
              608 × 56
          ================================================== */}
          <Link
            href="/checkin"
            className="
              mt-4
              flex
              h-[56px]
              w-full
              items-center
              justify-center
              gap-2
              rounded-[16px]
              bg-[#162E55]
              py-4
              text-white
              no-underline
              shadow-[0_4px_20px_0_#1C2E5A4D]
              outline-none
              focus:outline-none
              focus:ring-0
            "
          >
            <ScanLine
              className="
                h-[18px]
                w-[18px]
                shrink-0
              "
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <span
              className="
                font-chillax
                text-[16px]
                font-semibold
                leading-6
                tracking-normal
                text-white
              "
            >
              Scan Next Attendee
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}