"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ExternalLink,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";

const REGIONS = [
  "All Regions",
  "Global",
  "Sub-Saharan Africa",
  "Northern Europe",
  "Middle East & North Africa",
];

const SUB_PARTNERS = [
  { initials: "OSF", name: "OSF", region: "Global" },
  { initials: "ACA", name: "ACA", region: "Sub-Saharan Africa" },
  { initials: "NEC", name: "NEC", region: "Northern Europe" },
];

export default function PartnersDirectory() {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partners")
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data || []).map((p: any) => ({
          initials: p.name ? p.name.substring(0, 3).toUpperCase() : "PRT",
          name: p.name || "Unknown",
          region: "Global",
          tags: p.areas_of_work ? p.areas_of_work.split(",") : ["Partner"],
          since: "2024",
          website: p.website_url ? p.website_url.replace(/^https?:\/\//, '') : "",
          slug: p.id,
        }));
        setPartners(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPartners = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return partners.filter((partner) => {
      const matchesSearch =
        !searchValue ||
        partner.name.toLowerCase().includes(searchValue) ||
        partner.region.toLowerCase().includes(searchValue) ||
        partner.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchValue)
        );

      const matchesRegion =
        selectedRegion === "All Regions" ||
        partner.region.includes(selectedRegion);

      return matchesSearch && matchesRegion;
    });
  }, [search, selectedRegion, partners]);

  return (
    <div className="flex min-h-[1735px] bg-[#F4F5F7]">
      <Sidebar />

      <main className="min-h-[1735px] min-w-0 flex-1 bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[672px] px-[32px] py-[40px]">
          <div className="h-[54px] w-full">
            <h1 className="m-0 h-[32px] w-full font-chillax text-[24px] font-bold leading-[32px] tracking-[0px] text-[#0E1726]">
              Partner Directory
            </h1>

            <p className="m-0 h-[22px] w-full pt-[2px] font-inter text-[14px] font-normal leading-[20px] tracking-[0px] text-[#6B7590]">
              8 partner organisations
            </p>
          </div>

          <section className="mt-[16px] min-h-[127px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[16px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search organisations, focus areas…"
              className="h-[52.5px] w-full rounded-[14px] border border-[#1C2E5A1A] bg-[#EEF1F5] px-[16px] py-[14px] font-inter text-[15px] font-normal leading-[18px] tracking-[0px] text-[#0E1726] outline-none placeholder:text-[#6B7590] focus:border-[#162E55] focus:outline-none focus:ring-0"
            />

            <div className="w-full pt-[12px]">
              <div className="flex w-full items-center gap-[8px] overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {REGIONS.map((region) => {
                  const active =
                    selectedRegion === region;

                  return (
                    <button
                      key={region}
                      type="button"
                      style={{ fontSize: 11, lineHeight: "16.5px", fontWeight: 600 }}
                      onClick={() =>
                        setSelectedRegion(region)
                      }
                      className={`flex h-[28.5px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] px-[12px] py-[6px] font-inter text-[11px] font-semibold leading-[16.5px] tracking-[0px] active:scale-[0.98] active:bg-[#102440] active:text-white active:shadow-inner ${
                        active
                          ? "bg-[#162E55] text-white"
                          : "bg-[#EEF1F5] text-[#6B7590]"
                      }`}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-[16px] w-full">
            <p className="m-0 h-[15px] font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
              Sub-Partners
            </p>

            <div className="mt-[12px] grid w-full grid-cols-3 gap-[10px]">
              {SUB_PARTNERS.map((partner) => (
                <button
                  key={partner.name}
                  type="button"
                  className="flex h-[116px] min-w-0 flex-col items-center justify-center rounded-[24px] border border-[#1C2E5A1A] bg-white shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]"
                >
                  <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[14px] bg-[#162E55]">
                    <span className="font-chillax text-[12px] font-bold leading-[16px] text-white">
                      {partner.initials}
                    </span>
                  </div>

                  <p className="m-0 mt-[8px] font-inter text-[12px] font-semibold leading-[16px] tracking-[0px] text-[#0E1726]">
                    {partner.name}
                  </p>

                  <p className="m-0 mt-[3px] max-w-[150px] truncate font-inter text-[10px] font-normal leading-[15px] tracking-[0px] text-[#6B7590]">
                    {partner.region}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-[20px] w-full">
            <p className="m-0 h-[15px] font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
              All Partners
            </p>

            <div className="mt-[12px] flex w-full flex-col gap-[10px]">
              {filteredPartners.map((partner) => (
                <article
                  key={partner.name}
                  className="h-[136px] w-full overflow-hidden rounded-[24px] border border-[#1C2E5A1A] bg-white px-[16px] py-[14px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]"
                >
                  <div className="flex h-[76px] w-full items-start">
                    <Link
                      href={`/partners/${partner.slug}`}
                      className="flex min-w-0 flex-1 items-start no-underline"
                    >
                      <div
                        className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] ${
                          partner.mutedLogo
                            ? "bg-[#5F6878]"
                            : "bg-[#162E55]"
                        }`}
                      >
                        <span className="font-chillax text-[12px] font-bold leading-[16px] text-white">
                          {partner.initials}
                        </span>
                      </div>

                      <div className="ml-[12px] min-w-0 flex-1">
                        <p className="m-0 truncate font-inter text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#0E1726]">
                          {partner.name}
                        </p>

                        <p className="m-0 mt-[1px] truncate font-inter text-[11px] font-normal leading-[16px] tracking-[0px] text-[#6B7590]">
                          {partner.region}
                        </p>

                        <div className="mt-[6px] flex flex-wrap items-center gap-[6px]">
                          {partner.tags.map((tag) => (
                            <span
                              key={tag}
                              className="flex h-[23px] items-center justify-center whitespace-nowrap rounded-full bg-[#EEF1F5] px-[10px] font-inter text-[10px] font-semibold leading-[15px] text-[#6B7590]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <ChevronRight
                        className="ml-[8px] mt-[2px] h-[16px] w-[16px] shrink-0 text-[#6B7590]"
                        strokeWidth={1.3}
                        aria-hidden="true"
                      />
                    </Link>
                  </div>

                  <div className="flex h-[31px] w-full items-end justify-between border-t border-[#1C2E5A1A]">
                    <p className="m-0 font-inter text-[11px] font-normal leading-[16px] tracking-[0px] text-[#6B7590]">
                      Partner since {partner.since}
                    </p>

                    <a
                      href={`https://${partner.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex max-w-[260px] items-center gap-[4px] truncate font-inter text-[11px] font-medium leading-[16px] tracking-[0px] text-[#1C2E5A] no-underline"
                    >
                      <span className="truncate">
                        {partner.website}
                      </span>

                      <ExternalLink
                        className="h-[11px] w-[11px] shrink-0"
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </article>
              ))}

              {filteredPartners.length === 0 && (
                <div className="rounded-[24px] border border-[#1C2E5A1A] bg-white p-[24px] text-center shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
                  <p className="m-0 font-inter text-[14px] font-normal leading-[20px] text-[#6B7590]">
                    No partners match your search.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
