
"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Mail,
  MoveLeft,
  Send,
  Globe2,
} from "lucide-react";

type Partner = {
  initials: string;
  type: string;
  since: string;
  name: string;
  tags: string[];
  about: string;
  contactName?: string;
  contactEmail?: string;
  website: string;
};

const partners: Partner[] = [
  {
    initials: "OSF",
    type: "Foundation",
    since: "Partner since 2018",
    name: "Open Society Foundations",
    tags: ["Democracy", "Human Rights", "Justice"],
    about:
      "Open Society Foundations builds vibrant and tolerant democracies. OAK partnership covers digital rights and justice initiatives across Eastern Europe and Central Asia.",
    contactName: "Maria Schmidt",
    contactEmail: "m.schmidt@osf.org",
    website: "https://www.opensocietyfoundations.org/",
  },
  {
    initials: "ACA",
    type: "NGO",
    since: "Partner since 2020",
    name: "Africa Climate Alliance",
    tags: ["Climate Justice", "Youth Advocacy", "Climate"],
    about:
      "Africa Climate Alliance works with young people and communities to advance climate justice and strengthen climate action across Africa.",
    website: "https://africaclimatealliance.org/",
  },
  {
    initials: "NEC",
    type: "Research",
    since: "Partner since 2021",
    name: "Nordic Evaluation Centre",
    tags: ["Evaluation", "Learning", "Research"],
    about:
      "Nordic Evaluation Centre supports evidence-based learning, evaluation and research to improve social impact and programme effectiveness.",
    website: "https://nordicevaluation.org/",
  },
];

export default function PartnersScreen() {
  const [selectedPartner, setSelectedPartner] = useState<Partner>(
    partners[0]
  );

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[var(--oak-page)]">
      <section className="mx-auto flex w-full max-w-[672px] flex-col items-center px-8 py-10">
        {/* =====================================================
            BACK TO PARTNER DIRECTORY
        ===================================================== */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex h-5 items-center gap-2 font-inter text-[14px] font-bold leading-5 text-[#1C2E5A]"
        >
          <MoveLeft size={16} strokeWidth={2} />

          <span>Partner Directory</span>
        </button>

        {/* =====================================================
            PARTNER CARDS
        ===================================================== */}
        <div className="flex w-full flex-col pt-5">
          {partners.map((partner) => {
            const selected = selectedPartner.name === partner.name;

            return (
              <button
                key={partner.name}
                type="button"
                onClick={() => setSelectedPartner(partner)}
                className="w-full text-left"
              >
                <article
                  className={[
                    "relative w-full overflow-hidden rounded-[24px] p-5",
                    "shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]",
                    "transition-all",
                    selected
                      ? "bg-[var(--oak-navy)]"
                      : "border border-[#1C2E5A1A] bg-white",
                  ].join(" ")}
                >
                  {/* Decorative background circle */}
                  <div
                    className={[
                      "absolute -right-16 -top-16 h-36 w-36 rounded-full",
                      selected
                        ? "bg-white/10"
                        : "bg-[var(--oak-navy)]/5",
                    ].join(" ")}
                  />

                  <div className="relative flex w-full flex-col">
                    {/* -----------------------------------------
                        HEADER
                    ----------------------------------------- */}
                    <div className="flex w-full items-center gap-4">
                      {/* Initials */}
                      <div
                        className={[
                          "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl",
                          "bg-[var(--oak-navy)]",
                        ].join(" ")}
                      >
                        <span className="font-chillax text-center text-[16px] font-bold leading-5 text-white">
                          {partner.initials}
                        </span>
                      </div>

                      {/* Partner information */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={[
                            "font-inter text-[10px] font-bold uppercase",
                            "leading-[15px] tracking-[1px]",
                            selected
                              ? "text-white/60"
                              : "text-[var(--oak-muted)]",
                          ].join(" ")}
                        >
                          {partner.type} · {partner.since}
                        </p>

                        <h2
                          className={[
                            "pt-1 font-chillax text-[20px] font-bold leading-7",
                            selected
                              ? "text-white"
                              : "text-[var(--oak-text)]",
                          ].join(" ")}
                        >
                          {partner.name}
                        </h2>
                      </div>
                    </div>

                    {/* -----------------------------------------
                        TAGS
                    ----------------------------------------- */}
                    <div className="flex w-full flex-wrap gap-2 pt-4">
                      {partner.tags.map((tag) => (
                        <span
                          key={tag}
                          className={[
                            "inline-flex items-center rounded-full",
                            "px-[10px] py-1",
                            "font-inter text-[11px] font-bold",
                            "leading-[17px] tracking-[0.22px]",
                            selected
                              ? "bg-white/20 text-white"
                              : "bg-[var(--oak-input)] text-[var(--oak-navy)]",
                          ].join(" ")}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </button>
            );
          })}
        </div>

        {/* =====================================================
            ABOUT
        ===================================================== */}
        <section className="w-full pt-4">
          <div className="rounded-[24px] border border-[#1C2E5A1A] bg-white p-5 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <p className="font-inter text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-[var(--oak-muted)]">
              About
            </p>

            <p className="pt-2 font-inter text-[14px] font-normal leading-5 text-[var(--oak-text)]">
              {selectedPartner.about}
            </p>

            {/* Contact at Convening */}
            {selectedPartner.contactName &&
              selectedPartner.contactEmail && (
                <div className="mt-4 rounded-[16px] border border-[#1C2E5A1A] bg-[var(--oak-page)] p-4">
                  <p className="font-inter text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-[var(--oak-muted)]">
                    Contact at Convening
                  </p>

                  <p className="pt-2 font-inter text-[14px] font-bold leading-5 text-[var(--oak-text)]">
                    {selectedPartner.contactName}
                  </p>

                  <a
                    href={`mailto:${ selectedPartner.contactEmail } `}
                    onClick={(event) => event.stopPropagation()}
                    className="pt-1 font-inter text-[12px] leading-4 text-[var(--oak-navy)]"
                  >
                    {selectedPartner.contactEmail}
                  </a>
                </div>
              )}
          </div>
        </section>

        {/* =====================================================
            ACTION BUTTONS
        ===================================================== */}
        <section className="flex w-full flex-col gap-3 pt-4">
          {/* Visit Website */}
          <a
            href={selectedPartner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between rounded-2xl bg-[var(--oak-navy)] px-5 py-4 shadow-[0_4px_16px_0_#00000026]"
          >
            <span className="flex items-center gap-2 font-chillax text-[14px] font-semibold leading-5 text-white">
              <Globe2 size={15} strokeWidth={2} />

              Visit Website
            </span>

            <ExternalLink
              size={14}
              strokeWidth={2}
              className="text-white"
            />
          </a>

          {/* Send Message */}
          <button
            type="button"
            onClick={() => {
              if (selectedPartner.contactEmail) {
                window.location.href = `mailto:${ selectedPartner.contactEmail } `;
              }
            }}
            className="flex w-full items-center justify-between rounded-[24px] border border-[#1C2E5A1A] bg-white px-5 py-4 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]"
          >
            <span className="flex items-center gap-2 font-inter text-[14px] font-bold leading-5 text-[var(--oak-text)]">
              <Mail size={15} strokeWidth={2} />

              Send Message
            </span>

            <Send
              size={14}
              strokeWidth={2}
              className="text-[var(--oak-navy)]"
            />
          </button>
        </section>
      </section>
    </main>
  );
}
