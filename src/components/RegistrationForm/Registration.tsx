"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

      /*
        The Figma design has one combined
        "Travel & Accommodation" field.

        For now accommodation_requirements is left null
        so the UI stays faithful to the design.
      */
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

  return (
    /*
      ========================================
      FORM MARGIN CONTAINER

      Figma:
      width: 608px
      padding-top: 16px
      ========================================
    */
    <div className="w-full pt-4">

      {/*
        ========================================
        WHITE REGISTRATION CARD

        Figma:
        width: 608px
        border radius: 24px
        border: 1px
        padding: 20px
        ========================================
      */}
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
        {/*
          ========================================
          TITLE
          ========================================
        */}
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

        {/*
          ========================================
          FORM
          ========================================
        */}
        <form
          onSubmit={handleSubmit}
          className="w-full pt-5"
        >
          {/*
            ========================================
            ERROR MESSAGE
            ========================================
          */}
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

          {/*
            ========================================
            FIRST + LAST NAME
            566px total
            2 columns
            12px gap
            ========================================
          */}
          <div className="grid w-full grid-cols-2 gap-3">

            {/* FIRST NAME */}
            <div className="w-full">
              <label
                htmlFor="first_name"
                className="
                  block
                  h-4
                  font-[var(--font-inter)]
                  text-xs
                  font-semibold
                  uppercase
                  leading-4
                  tracking-[0.3px]
                  text-[#6B7590]
                "
              >
                First Name{" "}
                <span className="text-[#E14C4C]">
                  *
                </span>
              </label>

              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Maria"
                required
                className="
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
                  outline-none
                  placeholder:text-[#6B7590]
                  focus:border-[#162E55]
                "
              />
            </div>

            {/* LAST NAME */}
            <div className="w-full">
              <label
                htmlFor="last_name"
                className="
                  block
                  h-4
                  font-[var(--font-inter)]
                  text-xs
                  font-semibold
                  uppercase
                  leading-4
                  tracking-[0.3px]
                  text-[#6B7590]
                "
              >
                Last Name{" "}
                <span className="text-[#E14C4C]">
                  *
                </span>
              </label>

              <input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Schmidt"
                required
                className="
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
                  outline-none
                  placeholder:text-[#6B7590]
                  focus:border-[#162E55]
                "
              />
            </div>
          </div>

          {/*
            ========================================
            ORGANISATION
            ========================================
          */}
          <div className="pt-3">
            <label
              htmlFor="organization"
              className="
                block
                h-4
                font-[var(--font-inter)]
                text-xs
                font-semibold
                uppercase
                leading-4
                tracking-[0.3px]
                text-[#6B7590]
              "
            >
              Organisation{" "}
              <span className="text-[#E14C4C]">
                *
              </span>
            </label>

            <input
              id="organization"
              name="organization"
              type="text"
              placeholder="Your organisation name"
              required
              className="
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
                outline-none
                placeholder:text-[#6B7590]
                focus:border-[#162E55]
              "
            />
          </div>

          {/*
            ========================================
            SUB-PARTNER / PROGRAMME AREA
            ========================================
          */}
          <div className="pt-3">
            <label
              htmlFor="sub_partner_program_area"
              className="
                block
                h-4
                font-[var(--font-inter)]
                text-xs
                font-semibold
                uppercase
                leading-4
                tracking-[0.3px]
                text-[#6B7590]
              "
            >
              Sub-Partner / Programme Area
            </label>

            <input
              id="sub_partner_program_area"
              name="sub_partner_program_area"
              type="text"
              placeholder="Optional"
              className="
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
                outline-none
                placeholder:text-[#6B7590]
                focus:border-[#162E55]
              "
            />
          </div>

          {/*
            ========================================
            ROLE / CAPACITY
            ========================================
          */}
          <div className="pt-3">
            <label
              htmlFor="role"
              className="
                block
                h-4
                font-[var(--font-inter)]
                text-xs
                font-semibold
                uppercase
                leading-4
                tracking-[0.3px]
                text-[#6B7590]
              "
            >
              Role / Capacity{" "}
              <span className="text-[#E14C4C]">
                *
              </span>
            </label>

            <select
              id="role"
              name="role"
              required
              defaultValue=""
              className="
                mt-[6px]
                h-[52.5px]
                w-full
                rounded-[14px]
                border
                border-[#1C2E5A1A]
                bg-[#EEF1F5]
                px-4
                font-[var(--font-inter)]
                text-[15px]
                font-normal
                leading-[23px]
                text-[#0E1726]
                outline-none
                focus:border-[#162E55]
              "
            >
              <option value="" disabled>
                Select your role
              </option>

              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/*
            ========================================
            EMAIL
            ========================================
          */}
          <div className="pt-3">
            <label
              htmlFor="email"
              className="
                block
                h-4
                font-[var(--font-inter)]
                text-xs
                font-semibold
                uppercase
                leading-4
                tracking-[0.3px]
                text-[#6B7590]
              "
            >
              Email Address{" "}
              <span className="text-[#E14C4C]">
                *
              </span>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@organisation.org"
              required
              className="
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
                outline-none
                placeholder:text-[#6B7590]
                focus:border-[#162E55]
              "
            />
          </div>

          {/*
            ========================================
            PHONE
            ========================================
          */}
          <div className="pt-3">
            <label
              htmlFor="phone"
              className="
                block
                h-4
                font-[var(--font-inter)]
                text-xs
                font-semibold
                uppercase
                leading-4
                tracking-[0.3px]
                text-[#6B7590]
              "
            >
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+41 xx xxx xx xx"
              className="
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
                outline-none
                placeholder:text-[#6B7590]
                focus:border-[#162E55]
              "
            />
          </div>

          {/*
            ========================================
            REQUIREMENTS OUTER MARGIN

            Figma:
            566 × 324.5
            padding-top: 16px
            ========================================
          */}
          <div className="h-[324.5px] w-full pt-4">

            {/*
              ======================================
              REQUIREMENTS INNER CARD

              Figma:
              height: 308.5
              padding: 16px
              radius: 16px
              ======================================
            */}
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

              {/* DIETARY */}
              <div className="h-[86.5px] w-full pt-3">
                <label
                  htmlFor="dietary_requirements"
                  className="
                    block
                    h-4
                    font-[var(--font-inter)]
                    text-xs
                    font-semibold
                    uppercase
                    leading-4
                    tracking-[0.3px]
                    text-[#6B7590]
                  "
                >
                  Dietary Requirements
                </label>

                <input
                  id="dietary_requirements"
                  name="dietary_requirements"
                  type="text"
                  placeholder="e.g. Vegetarian, Halal, Gluten-free"
                  className="
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
                    outline-none
                    placeholder:text-[#6B7590]
                    focus:border-[#162E55]
                  "
                />
              </div>

              {/* ACCESSIBILITY */}
              <div className="h-[86.5px] w-full pt-3">
                <label
                  htmlFor="accessibility_requirements"
                  className="
                    block
                    h-4
                    font-[var(--font-inter)]
                    text-xs
                    font-semibold
                    uppercase
                    leading-4
                    tracking-[0.3px]
                    text-[#6B7590]
                  "
                >
                  Accessibility Requirements
                </label>

                <input
                  id="accessibility_requirements"
                  name="accessibility_requirements"
                  type="text"
                  placeholder="e.g. Wheelchair access, hearing loop"
                  className="
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
                    outline-none
                    placeholder:text-[#6B7590]
                    focus:border-[#162E55]
                  "
                />
              </div>

              {/* TRAVEL + ACCOMMODATION */}
              <div className="h-[86.5px] w-full pt-3">
                <label
                  htmlFor="travel_requirements"
                  className="
                    block
                    h-4
                    font-[var(--font-inter)]
                    text-xs
                    font-semibold
                    uppercase
                    leading-4
                    tracking-[0.3px]
                    text-[#6B7590]
                  "
                >
                  Travel &amp; Accommodation
                </label>

                <input
                  id="travel_requirements"
                  name="travel_requirements"
                  type="text"
                  placeholder="e.g. Flight from London, hotel needed"
                  className="
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
                    outline-none
                    placeholder:text-[#6B7590]
                    focus:border-[#162E55]
                  "
                />
              </div>
            </div>
          </div>

          {/*
            ========================================
            CONSENT

            Figma outer:
            height: 112px

            Inner:
            height: 80px
            padding: 16px
            gap: 12px
            ========================================
          */}
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

          {/*
            ========================================
            REGISTER BUTTON
            566 × 56
            ========================================
          */}
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
              bg-[#162E55]
              font-chillax
              text-base
              font-semibold
              leading-6
              text-white
              shadow-[0_4px_20px_0_#1C2E5A4D]
              transition-opacity
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