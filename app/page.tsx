import Link from "next/link";
import Image from "next/image";
import {
  UsersRound,
  CalendarDays,
  Layers3,
} from "lucide-react";

import type { ReactNode } from "react";

function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex min-h-[62px] items-start gap-2 rounded-xl border border-[#e3e7ec] bg-white p-3 shadow-[0_2px_8px_rgba(28,46,90,0.04)]">
      <div className="flex h-4 w-4 items-center justify-center text-[10px] text-[#162e55]">{icon}</div>

      <div className="flex flex-col">
        <span className="w-fit text-[13px] font-bold leading-4 text-[#16243a]">{value}</span>
        <span className="mt-px text-[12px] font-normal leading-4 text-[#6B7590]">{label}</span>
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-[5px] block w-fit font-semibold text-[12px] leading-4 tracking-[0.3px] uppercase text-[#6B7590]">
      {children}
      {required && <span className="required">*</span>}
    </label>
  );
}

function TextInput({
  placeholder,
  type = "text",
  className = "",
}: {
  placeholder: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`h-[34px] w-full rounded-[9px] border-0 bg-[#edf0f4] px-3 text-[10px] leading-[14px] text-[#16243a] outline-none transition-[box-shadow,background] placeholder:text-[#8993a3] focus:bg-[#e9edf3] focus:shadow-[0_0_0_2px_rgba(22,46,85,0.1)] ${className}`}
    />
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen bg-[#f5f6f8] text-[#16243a] [font-family:Inter,Arial,sans-serif]">
      {/* LEFT NAVIGATION */}
      <aside className="flex min-h-screen w-[256px] flex-col justify-between border-r border-[#1C2E5A]/10 bg-white px-1.5 py-[14px] pb-4 max-md:min-h-0 max-md:w-full max-md:flex-row max-md:items-center max-md:border-b max-md:border-r-0 max-md:px-4 max-md:py-3">
        <div className="w-full max-md:flex max-md:items-center max-md:gap-3">
          <div className="flex h-fit w-full flex-col border-b border-[#1C2E5A]/10 pb-6 text-center max-md:border-0 max-md:pb-0">
            <Image
              src="/Logo-Oak-Foundation.svg (1) 1 (2).svg"
              alt="OAK Foundation"
              width={85}
              height={53}
              className="mx-auto h-auto w-full max-w-[85px]"
            />
            <span className="w-fit self-center font-semibold text-[12px] leading-4 tracking-[1.2px] uppercase text-[#6B7590] max-md:hidden">
              PARTNER CONVENING 2026
            </span>
          </div>

          <nav className="mt-[14px] max-md:mt-0">
            <Link
              href="/"
              className="flex min-h-[44px] w-full flex-row items-center justify-center gap-3 rounded-2xl bg-[#162E55] px-4 py-3 text-white shadow-[0_4px_16px_rgba(28,46,90,0.07)] transition hover:bg-[#1d3b6d] active:translate-y-px"
            >
              <span className="font-[Inter] font-semibold text-[14px] leading-[20px] text-center tracking-normal text-[#FFFFFF]">
                Register
              </span>
            </Link>
          </nav>
        </div>

        <div className="flex h-auto w-full flex-col border-t border-[#1C2E5A]/10 p-5 text-[10px] leading-[15px] text-[#6e7788] max-md:hidden">
          <div className="location-dot">●</div>

          <div>
            <p className="font-[Inter] font-semibold text-[12px] leading-[16px] tracking-normal text-[#0E1726]">
              Harare, Zimbabwe
            </p>
            <span className="font-[Inter] font-normal text-[10px] leading-[15px] tracking-normal text-[#6B7590]">
              9–11 November 2026
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="mx-auto flex min-h-screen w-full max-w-[672px] flex-col px-8 py-10 max-md:px-4 max-md:py-6 max-[420px]:px-3 max-[420px]:py-4">
        <div className="flex h-auto w-full flex-1 flex-col">

          {/* HERO */}
          <header className="h-[167px] w-full overflow-hidden rounded-3xl bg-[#162e55] shadow-[0_4px_16px_rgba(28,46,90,0.07)] max-[420px]:h-auto max-[420px]:min-h-[167px]">
            <div className="m-6 flex h-[calc(100%-48px)] w-[calc(100%-48px)] flex-col max-[420px]:m-5 max-[420px]:h-[calc(100%-40px)] max-[420px]:w-[calc(100%-40px)]">
              <h1 className="w-[242px] font-bold text-[30px] leading-[37.5px] text-white [font-family:Chillax,sans-serif] max-[420px]:w-auto max-[420px]:text-[26px] max-[420px]:leading-8">
                Partner
                <br />
                Convening 2026
              </h1>

              <p className="mt-2 text-[14px] leading-5 text-white/50">
                Cresta Lodge, Msasa · 9–11 November 2026
              </p>
            </div>
          </header>

          {/* STATS */}
          <div className="mt-2 grid w-full grid-cols-3 gap-2 max-md:grid-cols-1">

            {/* ATTENDEES */}
            <StatCard
              value="110+"
              label="Attendees"
              icon={
                <UsersRound
                  size={16}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              }
            />

            {/* SESSIONS */}
            <StatCard
              value="24"
              label="Sessions"
              icon={
                <CalendarDays
                  size={16}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              }
            />

            {/* PARTNERS */}
            <StatCard
              value="38"
              label="Partners"
              icon={
                <Layers3
                  size={16}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              }
            />

          </div>

          {/* REGISTRATION CARD */}
          <section className="mt-2 w-full rounded-2xl border border-[#e3e7ec] bg-white p-6 shadow-[0_4px_16px_rgba(28,46,90,0.05)] max-md:p-5 max-[420px]:p-4">
            <div className="mb-[18px]">
              <h2 className="m-0 text-base font-bold leading-5 text-[#16243a]">Registration Form</h2>
            </div>

            <form className="flex flex-col gap-[10px]">

              {/* NAME */}
              <div className="grid w-full grid-cols-2 gap-2 max-md:grid-cols-1">
                <div className="w-full">
                  <FieldLabel required>
                    First Name
                  </FieldLabel>

                  <TextInput placeholder="Maria" />
                </div>

                <div className="w-full">
                  <FieldLabel required>
                    Last Name
                  </FieldLabel>

                  <TextInput placeholder="Schmidt" />
                </div>
              </div>

              {/* ORGANISATION */}
              <div className="w-full">
                <FieldLabel required>
                  Organisation
                </FieldLabel>

                <TextInput
                  placeholder="Your organisation name"
                />
              </div>

              {/* SUB PARTNER */}
              <div className="w-full">
                <FieldLabel>
                  Sub-Partner / Programme Area
                </FieldLabel>

                  <TextInput placeholder="Optional" className="text-[15px] leading-none text-[#6b7590] placeholder:text-[#6b7590]" />
              </div>

              {/* ROLE */}
              <div className="w-full">
                <FieldLabel required>
                  Role / Capacity
                </FieldLabel>

                <div className="relative">
                  <select
                    className="h-[34px] w-full appearance-none rounded-[9px] border-0 bg-[#edf0f4] px-3 pr-[30px] text-[15px] leading-none text-[#6b7590] outline-none focus:bg-[#e9edf3] focus:shadow-[0_0_0_2px_rgba(22,46,85,0.1)]"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select your role
                    </option>

                    <option value="partner">
                      Partner
                    </option>

                    <option value="staff">
                      OAK Staff
                    </option>

                    <option value="coordination">
                      Coordination Team
                    </option>

                    <option value="presenter">
                      Presenter
                    </option>

                    <option value="observer">
                      Observer
                    </option>
                  </select>

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#718096]">
                    ⌄
                  </span>
                </div>
              </div>

              {/* EMAIL */}
              <div className="w-full">
                <FieldLabel required>
                  Email Address
                </FieldLabel>

                <TextInput
                  type="email"
                  placeholder="you@organisation.org"
                  className="text-[15px] leading-none text-[#6b7590] placeholder:text-[#6b7590]"
                />
              </div>

              {/* PHONE */}
              <div className="w-full">
                <FieldLabel>
                  Phone Number
                </FieldLabel>

                <TextInput
                  type="tel"
                  placeholder="+41 xx xxx xx xx"
                  className="text-[15px] leading-none text-[#6b7590] placeholder:text-[#6b7590]"
                />
              </div>

              {/* REQUIREMENTS */}
              <div className="mt-0 overflow-hidden rounded-[10px] border border-[#e3e7ec] bg-[#edf0f4]">
                <h3 className="m-0 px-4 pb-2 pt-4 text-[10px] font-bold leading-[14px] tracking-[0.12em] uppercase text-[#16243a]">Requirements</h3>

                <div className="px-4 pb-[14px]">
                  <span className="mb-1 block text-[10px] font-bold leading-[14px] tracking-[0.08em] uppercase text-[#16243a]">Travel &amp; Accommodation</span>
                  <p className="m-0 text-[12px] leading-[18px] text-[#4d596d]">e.g. Flight from London, hotel needed</p>
                </div>

                <div className="px-4 pb-[14px]">
                  <span className="mb-1 block text-[10px] font-bold leading-[14px] tracking-[0.08em] uppercase text-[#16243a]">Dietary Requirements</span>
                  <p className="m-0 text-[12px] leading-[18px] text-[#4d596d]">e.g. Vegetarian, Halal, Gluten-free</p>
                </div>

                <div className="px-4 pb-[14px]">
                  <span className="mb-1 block text-[10px] font-bold leading-[14px] tracking-[0.08em] uppercase text-[#16243a]">Accessibility Requirements</span>
                  <p className="m-0 text-[12px] leading-[18px] text-[#4d596d]">e.g. Wheelchair access, hearing loop</p>
                </div>
              </div>

              {/* CONSENT */}
              <label className="flex min-h-12 cursor-pointer items-start gap-[7px] rounded-[9px] border border-[#e3e7ec] bg-white px-[10px] py-[9px] text-[7px] leading-[10px] text-[#687386]">
                <input
                  type="checkbox"
                  required
                />

                <span>
                  I agree to OAK Foundation&apos;s privacy policy and consent to my registration data being used for event coordination.
                </span>
              </label>

              {/* SUBMIT */}
              <button
                type="submit"
                className="flex min-h-[44px] w-full flex-row items-center justify-center gap-3 rounded-2xl bg-[#162E55] px-4 py-3 text-white shadow-[0_4px_16px_rgba(28,46,90,0.07)] transition hover:bg-[#1d3b6d] active:translate-y-px md:w-auto"
              >
                <span className="font-[Inter] font-semibold text-[14px] leading-[20px] text-center tracking-normal text-[#FFFFFF]">
                  Register
                </span>
              </button>

            </form>
          </section>

          {/* SECURITY FOOTER */}
          <p className="mx-auto mt-2 h-auto w-full max-w-[452px] text-center text-[6px] leading-[9px] text-[#9aa2ae]">
            Your data is secured and handled by OAK Foundation
            in accordance with GDPR.
          </p>

        </div>
      </section>
    </main>
  );
}