import Link from "next/link";
import {
  CircleX,
  Phone,
  RefreshCcw,
  TriangleAlert,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";

const POSSIBLE_REASONS = [
  "QR code belongs to a different event",
  "Registration was not completed",
  "Code has been altered or corrupted",
  "Attendee registered under a different email",
];

export default function CheckInErrorPage() {
  return (
    <main className="flex min-h-[941px] w-full bg-[#F4F5F7]">
      {/* =====================================================
          SHARED SIDEBAR
      ====================================================== */}
      <Sidebar />

      {/* =====================================================
          MAIN PAGE AREA
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
        {/* ===================================================
            FIGMA PAGE WRAPPER

            max-width: 672px
            height: 521px
            padding-top: 40px
            padding-left/right: 32px

            Inner width:
            672 - 32 - 32 = 608px
        ==================================================== */}
        <div
          className="
            flex
            h-[521px]
            w-full
            max-w-[672px]
            flex-col
            px-[32px]
            pt-[40px]
          "
        >
          {/* =================================================
              ERROR BANNER

              608 × 105
          ================================================== */}
          <div
            className="
              relative
              flex
              h-[105px]
              w-full
              shrink-0
              items-center
              overflow-hidden
              rounded-[24px]
              bg-[linear-gradient(135deg,#DC2626_0%,#EF4444_100%)]
              shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]
            "
          >
            {/* Decorative circle on right */}
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

            {/* Banner content */}
            <div
              className="
                relative
                z-10
                flex
                items-center
                gap-[16px]
                px-[24px]
              "
            >
              {/* Icon box - 56 × 56 */}
              <div
                className="
                  flex
                  h-[56px]
                  w-[56px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-[16px]
                  bg-white/20
                "
              >
                <CircleX
                  className="h-[30px] w-[30px] text-white"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>

              {/* Text */}
              <div className="w-[202px]">
                {/* CHECK-IN FAILED */}
                <p
                  className="
                    m-0
                    h-[15px]
                    font-[var(--font-inter)]
                    text-[10px]
                    font-semibold
                    uppercase
                    leading-[15px]
                    tracking-[1px]
                    text-white/60
                  "
                >
                  Check-In Failed
                </p>

                {/* QR Not Recognised */}
                <p
                  className="
                    m-0
                    h-[30px]
                    pt-[2px]
                    font-chillax
                    text-[20px]
                    font-bold
                    leading-[28px]
                    tracking-[0px]
                    text-white
                  "
                >
                  QR Not Recognised
                </p>

                {/* Description */}
                <p
                  className="
                    m-0
                    h-[20px]
                    font-[var(--font-inter)]
                    text-[14px]
                    font-normal
                    leading-[20px]
                    tracking-[0px]
                    text-white/60
                  "
                >
                  Code is invalid or unregistered
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              16px GAP
          ================================================== */}

          {/* =================================================
              POSSIBLE REASONS CARD

              608 × 184
              padding: 20
          ================================================== */}
          <div
            className="
              mt-[16px]
              h-[184px]
              w-full
              shrink-0
              rounded-[24px]
              border
              border-[#1C2E5A1A]
              bg-white
              p-[20px]
              shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]
            "
          >
            {/* Possible reasons heading */}
            <div
              className="
                flex
                h-[20px]
                w-full
                items-center
                gap-[8px]
              "
            >
              <TriangleAlert
                className="
                  h-[15px]
                  w-[15px]
                  shrink-0
                  text-[#EF4444]
                "
                strokeWidth={1.25}
                aria-hidden="true"
              />

              <p
                className="
                  m-0
                  font-[var(--font-inter)]
                  text-[14px]
                  font-semibold
                  leading-[20px]
                  tracking-[0px]
                  text-[#0E1726]
                "
              >
                Possible reasons
              </p>
            </div>

            {/* =================================================
                REASON 1
            ================================================== */}
            <div
              className="
                flex
                h-[30px]
                w-full
                items-start
                gap-[10px]
                pt-[10px]
              "
            >
              <div
                className="
                  flex
                  h-[16px]
                  w-[16px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFE2E2]
                "
              >
                <span className="h-[6px] w-[6px] rounded-full bg-[#EF4444]" />
              </div>

              <p
                className="
                  m-0
                  font-[var(--font-inter)]
                  text-[14px]
                  font-normal
                  leading-[20px]
                  tracking-[0px]
                  text-[#6B7590]
                "
              >
                {POSSIBLE_REASONS[0]}
              </p>
            </div>

            {/* =================================================
                REASON 2
            ================================================== */}
            <div
              className="
                flex
                h-[30px]
                w-full
                items-start
                gap-[10px]
                pt-[10px]
              "
            >
              <div
                className="
                  flex
                  h-[16px]
                  w-[16px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFE2E2]
                "
              >
                <span className="h-[6px] w-[6px] rounded-full bg-[#EF4444]" />
              </div>

              <p
                className="
                  m-0
                  font-[var(--font-inter)]
                  text-[14px]
                  font-normal
                  leading-[20px]
                  tracking-[0px]
                  text-[#6B7590]
                "
              >
                {POSSIBLE_REASONS[1]}
              </p>
            </div>

            {/* =================================================
                REASON 3
            ================================================== */}
            <div
              className="
                flex
                h-[30px]
                w-full
                items-start
                gap-[10px]
                pt-[10px]
              "
            >
              <div
                className="
                  flex
                  h-[16px]
                  w-[16px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFE2E2]
                "
              >
                <span className="h-[6px] w-[6px] rounded-full bg-[#EF4444]" />
              </div>

              <p
                className="
                  m-0
                  font-[var(--font-inter)]
                  text-[14px]
                  font-normal
                  leading-[20px]
                  tracking-[0px]
                  text-[#6B7590]
                "
              >
                {POSSIBLE_REASONS[2]}
              </p>
            </div>

            {/* =================================================
                REASON 4
            ================================================== */}
            <div
              className="
                flex
                h-[30px]
                w-full
                items-start
                gap-[10px]
                pt-[10px]
              "
            >
              <div
                className="
                  flex
                  h-[16px]
                  w-[16px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFE2E2]
                "
              >
                <span className="h-[6px] w-[6px] rounded-full bg-[#EF4444]" />
              </div>

              <p
                className="
                  m-0
                  font-[var(--font-inter)]
                  text-[14px]
                  font-normal
                  leading-[20px]
                  tracking-[0px]
                  text-[#6B7590]
                "
              >
                {POSSIBLE_REASONS[3]}
              </p>
            </div>
          </div>

          {/* =================================================
              TRY AGAIN

              Final dimensions:
              608 × 54
              radius: 24
              icon: 17 × 17
              gap: 8

              Typography:
              Chillax
              600
              16px
              24px
          ================================================== */}
          <Link
            href="/checkin"
            className="
              mt-[16px]
              flex
              h-[54px]
              w-full
              shrink-0
              items-center
              justify-center
              gap-[8px]
              rounded-[24px]
              bg-[#162E55]
              py-[16px]
              text-white
              no-underline
              shadow-[0_4px_20px_0_#1C2E5A4D]
              outline-none
              focus:outline-none
              focus:ring-0
              focus-visible:outline-none
              focus-visible:ring-0
            "
          >
            <RefreshCcw
              className="
                h-[17px]
                w-[17px]
                shrink-0
                text-white
              "
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <span
              className="
                whitespace-nowrap
                font-chillax
                text-[16px]
                font-semibold
                leading-[24px]
                tracking-[0px]
                text-white
              "
            >
              Try Again
            </span>
          </Link>

          {/* =================================================
              CONTACT COORDINATION TEAM

              Final dimensions:
              608 × 54
              radius: 24
              icon: 15 × 15
              gap: 8

              Typography:
              INTER
              600
              14px
              20px
          ================================================== */}
          <button
            type="button"
            className="
              mt-[12px]
              flex
              h-[54px]
              w-full
              shrink-0
              items-center
              justify-center
              gap-[8px]
              rounded-[24px]
              border
              border-[#1C2E5A1A]
              bg-white
              py-[16px]
              shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]
              outline-none
              focus:outline-none
              focus:ring-0
              focus-visible:outline-none
              focus-visible:ring-0
            "
          >
            <Phone
              className="
                h-[15px]
                w-[15px]
                shrink-0
                text-[#0E1726]
              "
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <span
              className="
                whitespace-nowrap
                font-[var(--font-inter)]
                text-[14px]
                font-semibold
                leading-[20px]
                tracking-[0px]
                text-[#0E1726]
              "
            >
              Contact Coordination Team
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}