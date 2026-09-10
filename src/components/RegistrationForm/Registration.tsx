"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import type { Role } from "@/lib/types";

const ROLES: Role[] = [
  "Partner",
  "OAK Staff",
  "Coordination Team",
  "Presenter",
  "Observer",
];

export default function RegistrationForm() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const [roleOpen, setRoleOpen] = useState(false);

  const roleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setRoleOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setRoleOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedRole) {
      setError("Please select your role.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);

    const payload = {
      first_name: form.get("first_name"),
      last_name: form.get("last_name"),
      organization: form.get("organization"),
      sub_partner_program_area:
        form.get("sub_partner_program_area") || null,

      role: form.get("role"),

      email: form.get("email"),
      phone: form.get("phone") || null,

      dietary_requirements:
        form.get("dietary_requirements") || null,

      accessibility_requirements:
        form.get("accessibility_requirements") || null,

      travel_requirements:
        form.get("travel_requirements") || null,

      accommodation_requirements: null,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();

        throw new Error(
          body.error || "Registration failed"
        );
      }

      const { role, registration_id } = await res.json();

      if (role === "Partner") {
        router.push(`/qr-code?id=${registration_id}`);
      } else if (role === "Coordination Team") {
        router.push("/checkin");
      } else {
        router.push("/programme");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );

      setSubmitting(false);
    }
  }

  const inputClass = `
    mt-[6px]
    h-[52.5px]
    w-full
    rounded-[14px]
    border
    border-[#1C2E5A1A]
    bg-[#EEF1F5]
    px-4
    py-[14px]
    font-[var(--font-inter)]
    text-[15px]
    font-normal
    leading-[18px]
    text-[#0E1726]
    placeholder:text-[#6B7590]
    outline-none
    focus:border-[#1C2E5A1A]
    focus:outline-none
    focus:ring-0
    focus:ring-offset-0
    focus-visible:border-[#1C2E5A1A]
    focus-visible:outline-none
    focus-visible:ring-0
    focus-visible:ring-offset-0
  `;

  const labelClass = `
    block
    h-4
    font-[var(--font-inter)]
    text-xs
    font-semibold
    uppercase
    leading-4
    tracking-[0.3px]
    text-[#6B7590]
  `;

  return (
    <div className="w-full pt-4">

      {/* ========================================
          WHITE REGISTRATION CARD
      ======================================== */}
      <div
        className="
          w-full
          rounded-3xl
          border
          border-[#1C2E5A1A]
          bg-white
          p-5
          shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]
        "
      >

        {/* ========================================
            TITLE
        ======================================== */}
        <h2
          className="
            h-7
            w-full
            font-chillax
            text-[18px]
            font-semibold
            leading-7
            tracking-normal
            text-[#0E1726]
          "
        >
          Registration Form
        </h2>

        {/* ========================================
            FORM
        ======================================== */}
        <form
          onSubmit={handleSubmit}
          className="w-full pt-5"
        >

          {/* ERROR */}
          {error && (
            <p
              role="alert"
              className="
                mb-4
                rounded-[14px]
                bg-red-50
                px-4
                py-3
                font-[var(--font-inter)]
                text-sm
                text-red-600
              "
            >
              {error}
            </p>
          )}

          {/* ========================================
              FIRST NAME + LAST NAME
          ======================================== */}
          <div className="grid w-full grid-cols-2 gap-3">

            {/* First Name */}
            <div className="w-full">
              <label
                htmlFor="first_name"
                className={labelClass}
              >
                First Name{" "}
                <span className="text-[#E14C4C]">*</span>
              </label>

              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Maria"
                required
                className={inputClass}
              />
            </div>

            {/* Last Name */}
            <div className="w-full">
              <label
                htmlFor="last_name"
                className={labelClass}
              >
                Last Name{" "}
                <span className="text-[#E14C4C]">*</span>
              </label>

              <input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Schmidt"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* ========================================
              ORGANISATION
          ======================================== */}
          <div className="pt-3">
            <label
              htmlFor="organization"
              className={labelClass}
            >
              Organisation{" "}
              <span className="text-[#E14C4C]">*</span>
            </label>

            <input
              id="organization"
              name="organization"
              type="text"
              placeholder="Your organisation name"
              required
              className={inputClass}
            />
          </div>

          {/* ========================================
              SUB-PARTNER / PROGRAMME AREA
          ======================================== */}
          <div className="pt-3">
            <label
              htmlFor="sub_partner_program_area"
              className={labelClass}
            >
              Sub-Partner / Programme Area
            </label>

            <input
              id="sub_partner_program_area"
              name="sub_partner_program_area"
              type="text"
              placeholder="Optional"
              className={inputClass}
            />
          </div>

          {/* ========================================
              ROLE / CAPACITY
          ======================================== */}
          <div
            ref={roleDropdownRef}
            className="relative pt-3"
          >
            <label
              id="role-label"
              className={labelClass}
            >
              Role / Capacity{" "}
              <span className="text-[#E14C4C]">*</span>
            </label>

            {/* Keeps form.get("role") working */}
            <input
              type="hidden"
              name="role"
              value={selectedRole}
            />

            {/* Closed role field */}
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={roleOpen}
              aria-labelledby="role-label"
              onClick={() => {
                setRoleOpen((current) => !current);
              }}
              className="
                mt-[6px]
                flex
                h-[52.5px]
                w-full
                items-center
                justify-between
                rounded-[14px]
                border
                border-[#1C2E5A1A]
                bg-[#EEF1F5]
                px-4
                font-[var(--font-inter)]
                text-[15px]
                font-normal
                leading-[22.5px]
                outline-none
                focus:border-[#1C2E5A1A]
                focus:outline-none
                focus:ring-0
                focus:ring-offset-0
                focus-visible:border-[#1C2E5A1A]
                focus-visible:outline-none
                focus-visible:ring-0
                focus-visible:ring-offset-0
              "
            >
              <span
                className={
                  selectedRole
                    ? "text-[#0E1726]"
                    : "text-[#6B7590]"
                }
              >
                {selectedRole || "Select your role"}
              </span>

              <ChevronDown
                className={`
                  h-4
                  w-4
                  shrink-0
                  text-[#6B7590]
                  transition-transform
                  ${roleOpen ? "rotate-180" : ""}
                `}
                aria-hidden="true"
              />
            </button>

            {/* ======================================
                OPEN ROLE MENU

                Figma Frame 3:
                width: 558px
                height: 200px
                padding-top: 15px
                padding-right: 17px
                padding-bottom: 17px

                Inner Frame:
                width: 539px
                gap: 7px
            ======================================= */}
            {roleOpen && (
              <div
                className="
                  absolute
                  left-1/2
                  top-[81px]
                  z-50
                  h-[200px]
                  w-[558px]
                  max-w-[calc(100vw-32px)]
                  -translate-x-1/2
                  rounded-[14px]
                  border
                  border-[#1C2E5A1A]
                  bg-white
                  pt-[15px]
                  pr-[17px]
                  pb-[17px]
                  pl-[2px]
                  shadow-[0_4px_16px_0_#1C2E5A12]
                "
              >
                <div
                  role="listbox"
                  aria-labelledby="role-label"
                  className="
                    ml-auto
                    flex
                    h-[171px]
                    w-[539px]
                    max-w-full
                    flex-col
                    gap-[7px]
                  "
                >

                  {/* Selected placeholder-style row */}
                  <div
                    className="
                      flex
                      h-[30px]
                      w-full
                      items-center
                      rounded-[5px]
                      bg-[#162E55]
                      px-[10px]
                      py-[3px]
                      font-[var(--font-inter)]
                      text-[15px]
                      font-normal
                      leading-[22.5px]
                      text-white
                    "
                  >
                    Select your role
                  </div>

                  {ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      role="option"
                      aria-selected={selectedRole === role}
                      onClick={() => {
                        setSelectedRole(role);
                        setRoleOpen(false);
                        setError(null);
                      }}
                      className="
                        flex
                        h-[22px]
                        w-full
                        items-center
                        justify-between
                        bg-white
                        px-[10px]
                        text-left
                        font-[var(--font-inter)]
                        text-[15px]
                        font-normal
                        leading-[22.5px]
                        text-[#0E1726]
                        outline-none
                        hover:bg-[#F4F5F7]
                        focus:bg-[#F4F5F7]
                        focus:outline-none
                        focus:ring-0
                      "
                    >
                      <span>{role}</span>

                      {selectedRole === role && (
                        <Check
                          className="h-4 w-4 text-[#162E55]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ========================================
              EMAIL ADDRESS
          ======================================== */}
          <div className="pt-3">
            <label
              htmlFor="email"
              className={labelClass}
            >
              Email Address{" "}
              <span className="text-[#E14C4C]">*</span>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@organisation.org"
              required
              className={inputClass}
            />
          </div>

          {/* ========================================
              PHONE NUMBER
          ======================================== */}
          <div className="pt-3">
            <label
              htmlFor="phone"
              className={labelClass}
            >
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+41 xx xxx xx xx"
              className={inputClass}
            />
          </div>

          {/* ========================================
              REQUIREMENTS
          ======================================== */}
          <div className="h-[324.5px] w-full pt-4">
            <div
              className="
                h-[308.5px]
                w-full
                rounded-2xl
                border
                border-[#1C2E5A1A]
                bg-[#EEF1F5]
                p-4
              "
            >

              <p
                className="
                  h-[15px]
                  font-[var(--font-inter)]
                  text-[10px]
                  font-semibold
                  uppercase
                  leading-[15px]
                  tracking-[1px]
                  text-[#6B7590]
                "
              >
                Requirements
              </p>

              {/* Dietary */}
              <div className="h-[86.5px] w-full pt-3">
                <label
                  htmlFor="dietary_requirements"
                  className={labelClass}
                >
                  Dietary Requirements
                </label>

                <input
                  id="dietary_requirements"
                  name="dietary_requirements"
                  type="text"
                  placeholder="e.g. Vegetarian, Halal, Gluten-free"
                  className={inputClass}
                />
              </div>

              {/* Accessibility */}
              <div className="h-[86.5px] w-full pt-3">
                <label
                  htmlFor="accessibility_requirements"
                  className={labelClass}
                >
                  Accessibility Requirements
                </label>

                <input
                  id="accessibility_requirements"
                  name="accessibility_requirements"
                  type="text"
                  placeholder="e.g. Wheelchair access, hearing loop"
                  className={inputClass}
                />
              </div>

              {/* Travel & Accommodation */}
              <div className="h-[86.5px] w-full pt-3">
                <label
                  htmlFor="travel_requirements"
                  className={labelClass}
                >
                  Travel &amp; Accommodation
                </label>

                <input
                  id="travel_requirements"
                  name="travel_requirements"
                  type="text"
                  placeholder="e.g. Flight from London, hotel needed"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ========================================
              CONSENT
          ======================================== */}
          <div className="h-28 w-full py-4">
            <label
              className="
                flex
                h-20
                w-full
                cursor-pointer
                items-start
                gap-3
                rounded-2xl
                border
                border-[#1C2E5A2E]
                p-4
              "
            >
              <input
                type="checkbox"
                name="consent"
                required
                className="
                  mt-[1px]
                  h-5
                  w-5
                  shrink-0
                  rounded-md
                  border-2
                  border-[#1C2E5A2E]
                  accent-[#162E55]
                  outline-none
                  focus:outline-none
                  focus:ring-0
                  focus-visible:outline-none
                  focus-visible:ring-0
                "
              />

              <span
                className="
                  font-[var(--font-inter)]
                  text-sm
                  font-normal
                  leading-[22.75px]
                  text-[#0E1726]
                "
              >
                I agree to OAK Foundation&apos;s{" "}
                <Link
                  href="/privacy"
                  className="underline"
                >
                  privacy policy
                </Link>{" "}
                and consent to my registration data being used
                for event coordination.
              </span>
            </label>
          </div>

          {/* ========================================
              REGISTER BUTTON
          ======================================== */}
          <button
            type="submit"
            disabled={submitting}
            className="
              flex
              h-14
              w-full
              items-center
              justify-center
              rounded-2xl
              border-0
              bg-[#162E55]
              font-chillax
              text-base
              font-semibold
              leading-6
              text-white
              shadow-[0_4px_20px_0_#1C2E5A4D]
              outline-none
              transition-opacity
              focus:outline-none
              focus:ring-0
              focus-visible:outline-none
              focus-visible:ring-0
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {submitting ? "Registering…" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}