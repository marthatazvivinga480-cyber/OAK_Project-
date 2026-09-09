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
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <span className="stat-value w-fit h-auto">{value}</span>
        <span className="stat-label font-normal text-[12px] leading-[16px] text-[#6B7590] w-auto h-auto">{label}</span>
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
    <label className="field-label">
      {children}
      {required && <span className="required">*</span>}
    </label>
  );
}

function TextInput({
  placeholder,
  type = "text",
}: {
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="form-input"
    />
  );
}

export default function Home() {
  return (
    <main className="oak-page">
      {/* LEFT NAVIGATION */}
      <aside className="sidebar w-[256px] min-h-screen bg-white border-r border-[#1C2E5A]/10">
        <div className="sidebar-top">
          <div className="oak-brand flex w-full h-fit flex-col pb-6 border-b border-[#1C2E5A]/10">
            <Image
              src="/Logo-Oak-Foundation.svg (1) 1 (2).svg"
              alt="OAK Foundation"
              width={85}
              height={53}
              className="mx-auto h-auto w-full max-w-[85px]"
            />
            <span className="sidebar-event font-semibold text-[12px] leading-[16px] tracking-[1.2px] uppercase text-[#6B7590] w-fit h-auto">
              PARTNER CONVENING 2026
            </span>
          </div>

          <nav className="sidebar-nav">
            <Link
              href="/"
              className="sidebar-link register-button w-full min-h-[44px] flex flex-row items-center justify-center gap-3 rounded-[16px] px-4 py-3 bg-[#162E55] shadow-sm"
            >
              <span className="font-[Inter] font-semibold text-[14px] leading-[20px] text-center tracking-normal text-[#FFFFFF]">
                Register
              </span>
            </Link>
          </nav>
        </div>

        <div className="sidebar-bottom flex w-full h-auto flex-col p-5 border-t border-[#1C2E5A]/10">
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
      <section className="registration-screen flex flex-col max-w-[672px] px-8 py-10 min-h-screen mx-auto w-full h-auto">
        <div className="registration-content flex w-full h-auto flex-1 flex-col">

          {/* HERO */}
          <header className="event-hero">
            <div className="event-hero-inner">
              <h1>
                Partner
                <br />
                Convening 2026
              </h1>

              <p>
                Cresta Lodge, Msasa · 9–11 November 2026
              </p>
            </div>
          </header>

          {/* STATS */}
          <div className="stats-grid">

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
          <section className="registration-card">
            <div className="registration-card-header">
              <h2>Registration Form</h2>
            </div>

            <form className="registration-form">

              {/* NAME */}
              <div className="form-row two-columns">
                <div className="field">
                  <FieldLabel required>
                    First Name
                  </FieldLabel>

                  <TextInput placeholder="Maria" />
                </div>

                <div className="field">
                  <FieldLabel required>
                    Last Name
                  </FieldLabel>

                  <TextInput placeholder="Schmidt" />
                </div>
              </div>

              {/* ORGANISATION */}
              <div className="field">
                <FieldLabel required>
                  Organisation
                </FieldLabel>

                <TextInput
                  placeholder="Your organisation name"
                />
              </div>

              {/* SUB PARTNER */}
              <div className="field">
                <FieldLabel>
                  Sub-Partner / Programme Area
                </FieldLabel>

                <TextInput placeholder="Optional" />
              </div>

              {/* ROLE */}
              <div className="field">
                <FieldLabel required>
                  Role / Capacity
                </FieldLabel>

                <div className="select-wrapper">
                  <select
                    className="form-input form-select"
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

                    <option value="sub-partner">
                      Sub-Partner
                    </option>

                    <option value="coordination">
                      Coordination Team
                    </option>
                  </select>

                  <span className="select-arrow">
                    ⌄
                  </span>
                </div>
              </div>

              {/* EMAIL */}
              <div className="field">
                <FieldLabel required>
                  Email Address
                </FieldLabel>

                <TextInput
                  type="email"
                  placeholder="you@organisation.org"
                />
              </div>

              {/* PHONE */}
              <div className="field">
                <FieldLabel>
                  Phone Number
                </FieldLabel>

                <TextInput
                  type="tel"
                  placeholder="+41 xx xxx xx xx"
                />
              </div>

              {/* REQUIREMENTS */}
              <div className="requirements requirements-display">
                <h3>Requirements</h3>

                <div className="requirement-line">
                  <span>Travel &amp; Accommodation</span>
                  <p>e.g. Flight from London, hotel needed</p>
                </div>

                <div className="requirement-line">
                  <span>Dietary Requirements</span>
                  <p>e.g. Vegetarian, Halal, Gluten-free</p>
                </div>

                <div className="requirement-line">
                  <span>Accessibility Requirements</span>
                  <p>e.g. Wheelchair access, hearing loop</p>
                </div>
              </div>

              {/* CONSENT */}
              <label className="consent">
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
                className="register-button w-full md:w-auto min-h-[44px] flex flex-row items-center justify-center gap-3 rounded-[16px] px-4 py-3 bg-[#162E55] shadow-sm"
              >
                <span className="font-[Inter] font-semibold text-[14px] leading-[20px] text-center tracking-normal text-[#FFFFFF]">
                  Register
                </span>
              </button>

            </form>
          </section>

          {/* SECURITY FOOTER */}
          <p className="security-note">
            Your data is secured and handled by OAK Foundation
            in accordance with GDPR.
          </p>

        </div>
      </section>
    </main>
  );
}