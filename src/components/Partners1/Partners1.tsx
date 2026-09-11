
"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronRight,
  ExternalLink,
  Search,
  MapPin,
} from "lucide-react";

type Partner = {
  initials: string;
  name: string;
  region: string;
  type: string;
  focusAreas: string[];
  since: string;
  website: string;
};

const regions = [
  "All Regions",
  "Global",
  "Sub-Saharan Africa",
  "Northern Europe",
  "Middle East & North Africa",
  "Global / East Africa",
  "Western Europe",
  "Europe",
];

const subPartners = [
  {
    initials: "OSF",
    name: "OSF",
    region: "Global",
  },
  {
    initials: "ACA",
    name: "ACA",
    region: "Sub-Saharan Africa",
  },
  {
    initials: "NEC",
    name: "NEC",
    region: "Northern Europe",
  },
];

const partners: Partner[] = [
  {
    initials: "OSF",
    name: "Open Society Foundations",
    region: "Global",
    type: "Foundation",
    focusAreas: ["Democracy", "Human Rights"],
    since: "Partner since 2018",
    website: "opensocietyfoundations.org",
  },
  {
    initials: "ACA",
    name: "Africa Climate Alliance",
    region: "Sub-Saharan Africa",
    type: "NGO",
    focusAreas: ["Climate Justice", "Youth Advocacy"],
    since: "Partner since 2020",
    website: "africaclimatealliance.org",
  },
  {
    initials: "NEC",
    name: "Nordic Evaluation Centre",
    region: "Northern Europe",
    type: "Research",
    focusAreas: ["Evaluation", "Learning"],
    since: "Partner since 2021",
    website: "nordicevaluation.org",
  },
  {
    initials: "MRG",
    name: "MENA Rights Group",
    region: "Middle East & North Africa",
    type: "NGO",
    focusAreas: ["Human Rights", "Documentation"],
    since: "Partner since 2019",
    website: "menarights.org",
  },
  {
    initials: "DFI",
    name: "Digital Frontiers Institute",
    region: "Global / East Africa",
    type: "Research",
    focusAreas: ["Digital Rights", "Internet Freedom"],
    since: "Partner since 2022",
    website: "digitalfrontiers.org",
  },
  {
    initials: "GAL",
    name: "Global Advocacy Lab",
    region: "Global",
    type: "NGO",
    focusAreas: ["Communications", "Campaigns"],
    since: "Partner since 2023",
    website: "globaladvocacylab.org",
  },
  {
    initials: "SP",
    name: "Sciences Po Paris",
    region: "Western Europe",
    type: "Academic",
    focusAreas: ["Research", "Policy"],
    since: "Partner since 2020",
    website: "sciencespo.fr",
  },
  {
    initials: "EFG",
    name: "Environmental Funders Group",
    region: "Europe",
    type: "Network",
    focusAreas: ["Environment", "Climate"],
    since: "Partner since 2017",
    website: "envfunders.eu",
  },
];

export default function PartnersPage() {
  const [search, setSearch] = useState("");
  const [activeRegion, setActiveRegion] = useState("All Regions");

  const filteredPartners = useMemo(() => {
    const query = search.trim().toLowerCase();

    return partners.filter((partner) => {
      const matchesRegion =
        activeRegion === "All Regions" ||
        partner.region === activeRegion;

      if (!query) {
        return matchesRegion;
      }

      const searchableText = [
        partner.name,
        partner.initials,
        partner.region,
        partner.type,
        partner.website,
        partner.since,
        ...partner.focusAreas,
      ]
        .join(" ")
        .toLowerCase();

      return matchesRegion && searchableText.includes(query);
    });
  }, [search, activeRegion]);

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[var(--oak-page)]">
      <section className="mx-auto flex w-full max-w-[672px] flex-col items-center px-5 py-10 sm:px-8">
        {/* Header */}
        <div className="w-full text-center">
          <h1 className="font-chillax text-[24px] font-bold leading-8 text-[var(--oak-text)]">
            Partner Directory
          </h1>

          <div className="pt-0.5">
            <p className="font-inter text-[14px] leading-5 text-[var(--oak-muted)]">
              8 partner organisations
            </p>
          </div>
        </div>

        {/* Search + Region Filter */}
        <div className="w-full pt-5">
          <div className="w-full rounded-[24px] border border-[var(--oak-border)] bg-white p-4 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            {/* Search */}
            <div className="relative h-[53px] w-full">
              <Search
                size={15}
                strokeWidth={2}
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[var(--oak-muted)]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search organisations, focus areas…"
                aria-label="Search organisations"
                className="h-[53px] w-full rounded-[14px] border border-transparent bg-[var(--oak-input)] py-[14px] pl-[42px] pr-4 font-inter text-[15px] leading-5 text-[var(--oak-text)] outline-none transition placeholder:text-[var(--oak-muted)] focus:border-[var(--oak-navy)]"
              />
            </div>

            {/* Region filters */}
            <div className="pt-3">
              <div className="flex w-full gap-2 overflow-x-auto pb-0 scrollbar-none">
                {regions.map((region) => {
                  const active = activeRegion === region;

                  return (
                    <button
                      key={region}
                      type="button"
                      onClick={() => setActiveRegion(region)}
                      className={[
                        "flex h-[29px] shrink-0 items-center justify-center rounded-[12px] px-3 font-inter text-[11px] font-bold leading-[17px] transition",
                        active
                          ? "bg-[var(--oak-navy)] text-white"
                          : "bg-[var(--oak-input)] text-[var(--oak-muted)] hover:bg-[#e4e8ee]",
                      ].join(" ")}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-partners */}
        <section className="w-full pt-4">
          <p className="font-inter text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-[var(--oak-muted)]">
            Sub-partners
          </p>

          <div className="flex w-full flex-col gap-2 pt-3">
            {subPartners.map((partner) => (
              <button
                key={partner.initials}
                type="button"
                className="flex min-h-[76px] w-full items-center gap-3 rounded-[24px] border border-[var(--oak-border)] bg-white p-[14px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D] transition hover:-translate-y-[1px]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[var(--oak-navy)]">
                  <span className="font-inter text-[12px] font-bold leading-4 text-white">
                    {partner.initials}
                  </span>
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <p className="font-inter text-[11px] font-bold leading-[14px] text-[var(--oak-text)]">
                    {partner.name}
                  </p>

                  <p className="font-inter text-[10px] leading-[13px] text-[var(--oak-muted)]">
                    {partner.region}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* All partners */}
        <section className="w-full pt-5">
          <div className="flex items-center justify-between">
            <p className="font-inter text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-[var(--oak-muted)]">
              All partners
            </p>

            {(search || activeRegion !== "All Regions") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveRegion("All Regions");
                }}
                className="font-inter text-[10px] font-bold text-[var(--oak-navy)]"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="flex w-full flex-col gap-3 pt-3">
            {filteredPartners.map((partner) => (
              <PartnerCard key={partner.initials} partner={partner} />
            ))}

            {filteredPartners.length === 0 && (
              <div className="rounded-[24px] border border-[var(--oak-border)] bg-white p-8 text-center shadow-[0_4px_16px_0_#1C2E5A12]">
                <p className="font-chillax text-[18px] font-semibold text-[var(--oak-text)]">
                  No partners found
                </p>

                <p className="mt-1 font-inter text-[12px] text-[var(--oak-muted)]">
                  Try a different organisation, region, or focus area.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <article className="w-full overflow-hidden rounded-[24px] border border-[var(--oak-border)] bg-white shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
      {/* Main information */}
      <div className="flex w-full gap-4 p-4">
        {/* Initials */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[var(--oak-navy)]">
          <span className="font-inter text-[14px] font-bold leading-5 text-white">
            {partner.initials}
          </span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name + icon */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="min-w-0 font-inter text-[14px] font-bold leading-[19px] text-[var(--oak-text)]">
              {partner.name}
            </h2>

            <MapPin
              size={16}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-[var(--oak-muted)]"
            />
          </div>

          {/* Type / region */}
          <p className="pt-1 font-inter text-[12px] leading-4 text-[var(--oak-muted)]">
            {partner.region} · {partner.type}
          </p>

          {/* Focus chips */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {partner.focusAreas.map((focus, index) => (
              <span
                key={focus}
                className={[
                  "inline-flex min-h-[25px] items-center rounded-full px-[10px] py-1 font-inter text-[11px] font-bold leading-[17px] tracking-[0.22px]",
                  index === 0
                    ? "bg-[#EEF1F9] text-[var(--oak-navy)]"
                    : "bg-[var(--oak-input)] text-[var(--oak-muted)]",
                ].join(" ")}
              >
                {focus}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex min-h-[49px] items-center justify-between border-t border-[var(--oak-border)] px-4 py-3">
        <span className="font-inter text-[12px] leading-4 text-[var(--oak-muted)]">
          {partner.since}
        </span>

        <a
          href={`https://${partner.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-inter text-[12px] font-medium leading-4 text-[var(--oak-navy)] transition hover:opacity-70"
        >
          <span>{partner.website}</span>

          <ExternalLink
            size={10}
            strokeWidth={2}
          />
        </a>
      </div>
    </article>
  );
}
