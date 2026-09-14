"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Globe, Mail } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface Partner {
  id: string;
  name: string;
  initials: string;
  tags: string[];
  website: string;
  description: string | null;
  contact_name: string | null;
  contact_email: string | null;
}

interface PartnerApiRecord {
  id: string;
  name?: string;
  areas_of_work?: string;
  website_url?: string;
  description?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
}

export default function PartnerDetail({ id }: { id: string }) {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/partners?id=${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Partner not found");
        return res.json();
      })
      .then((match: PartnerApiRecord) => {
        if (match && match.id) {
          setPartner({
            id: match.id,
            name: match.name || "Unknown",
            initials: match.name ? match.name.substring(0, 3).toUpperCase() : "PRT",
            tags: match.areas_of_work ? match.areas_of_work.split(",").map((t: string) => t.trim()) : [],
            website: match.website_url ? match.website_url.replace(/^https?:\/\//, "") : "",
            description: match.description ?? null,
            contact_name: match.contact_name ?? null,
            contact_email: match.contact_email ?? null,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[941px] bg-[#F4F5F7] max-md:flex-col">
        <Sidebar />
        <main className="flex min-h-[941px] min-w-0 flex-1 items-center justify-center bg-[#F4F5F7]">
          <p className="font-inter text-sm text-[#6B7590]">Loading partner…</p>
        </main>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex min-h-[941px] bg-[#F4F5F7] max-md:flex-col">
        <Sidebar />
        <main className="flex min-h-[941px] min-w-0 flex-1 flex-col items-center justify-center gap-4 bg-[#F4F5F7]">
          <p className="font-inter text-sm text-[#6B7590]">Partner not found.</p>
          <Link href="/partners" className="font-inter text-sm font-semibold text-[#1C2E5A]">
            ← Back to Partner Directory
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[941px] bg-[#F4F5F7] max-md:flex-col">
      <Sidebar />
      <main className="min-h-[941px] min-w-0 flex-1 bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[672px] px-[32px] pb-[40px] pt-[60px]">
          <Link
            href="/partners"
            className="flex h-[20px] w-fit items-center gap-[8px] font-inter text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#1C2E5A]"
          >
            <ChevronLeft className="h-[16px] w-[16px] shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <span>Partner Directory</span>
          </Link>

          <section className="relative mt-[20px] w-full overflow-hidden rounded-[24px] bg-[#162E55] p-6 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div aria-hidden="true" className="pointer-events-none absolute right-[-48px] top-[-32px] h-[144px] w-[144px] rounded-full bg-[#FFFFFF1A]" />
            <div className="relative flex items-start gap-[16px]">
              <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[16px] bg-[#FFFFFF33]">
                <span className="font-chillax text-[16px] font-bold leading-[20px] tracking-[0px] text-white">
                  {partner.initials}
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="m-0 font-chillax text-[20px] font-bold leading-[27.5px] tracking-[0px] text-white">
                  {partner.name}
                </h1>
              </div>
            </div>
            {partner.tags.length > 0 && (
              <div className="relative mt-4 flex flex-wrap items-center gap-[8px]">
                {partner.tags.map((tag) => (
                  <span key={tag} className="flex h-[24.5px] items-center justify-center rounded-full bg-[#FFFFFF33] px-[10px] py-[4px] font-inter text-[11px] font-semibold leading-[16.5px] tracking-[0.22px] text-white">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {partner.description && (
            <section className="mt-[16px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[20px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
              <p className="m-0 font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
                About
              </p>
              <p className="m-0 w-full pt-[12px] font-inter text-[14px] font-normal leading-[22.75px] tracking-[0px] text-[#0E1726]">
                {partner.description}
              </p>
            </section>
          )}

          {partner.contact_name && (
            <section className="mt-[16px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[20px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
              <p className="m-0 font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
                Contact at Convening
              </p>
              <div className="mt-[12px] flex items-center gap-[12px]">
                <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[16px] bg-[#162E55]">
                  <span className="font-chillax text-[14px] font-bold leading-[20px] text-white">
                    {partner.contact_name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="m-0 font-inter text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#0E1726]">
                    {partner.contact_name}
                  </p>
                  {partner.contact_email && (
                    <p className="m-0 font-inter text-[12px] font-normal leading-[16px] tracking-[0px] text-[#6B7590]">
                      {partner.contact_email}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {partner.website && (
            <a
              href={`https://${partner.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[16px] flex h-[52px] w-full items-center justify-between rounded-[16px] bg-[#162E55] px-[20px] py-[16px] shadow-[0_4px_16px_0_#00000026] transition-colors hover:bg-[#244675] active:bg-[#102440]"
            >
              <div className="flex items-center gap-[8px]">
                <Globe className="h-[14px] w-[14px] shrink-0 text-white" strokeWidth={1.5} aria-hidden="true" />
                <span className="font-chillax text-[14px] font-semibold leading-[20px] tracking-[0px] text-white">
                  Visit Website
                </span>
              </div>
              <ExternalLink className="h-[14px] w-[14px] shrink-0 text-white" strokeWidth={1.5} aria-hidden="true" />
            </a>
          )}

          {partner.contact_email && (
            <a
              href={`mailto:${partner.contact_email}`}
              className="mt-[12px] flex h-[54px] w-full items-center justify-between rounded-[24px] border border-[#1C2E5A1A] bg-white px-[20px] py-[16px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D] transition-colors hover:bg-[#EEF1F5] active:bg-[#E0E5ED]"
            >
              <div className="flex items-center gap-[8px]">
                <Mail className="h-[15px] w-[15px] shrink-0 text-[#0E1726]" strokeWidth={1.5} aria-hidden="true" />
                <span className="font-inter text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#0E1726]">
                  Send Message
                </span>
              </div>
              <ChevronRight className="h-[14px] w-[14px] shrink-0 text-[#6B7590]" strokeWidth={1.17} aria-hidden="true" />
            </a>
          )}
        </div>
      </main>
    </div>
  );
}