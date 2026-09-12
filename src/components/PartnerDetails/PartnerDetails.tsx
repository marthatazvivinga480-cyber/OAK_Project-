"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  Mail,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";

export default function PartnerDetail() {
  return (
    <div className="flex min-h-[941px] bg-[#F4F5F7]">
      <Sidebar />

      <main className="min-h-[941px] min-w-0 flex-1 bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[672px] px-[32px] pb-[40px] pt-[60px]">
          <Link
            href="/partners"
            className="flex h-[20px] w-fit items-center gap-[8px] font-inter text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#1C2E5A]"
          >
            <ChevronLeft
              className="h-[16px] w-[16px] shrink-0"
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <span>Partner Directory</span>
          </Link>

          <section className="relative mt-[20px] h-[152.5px] w-full overflow-hidden rounded-[24px] bg-[#162E55] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[496px] top-[40.5px] h-[144px] w-[144px] rounded-full bg-[#FFFFFF1A]"
            />

            <div className="absolute left-[24px] top-[24px] flex items-start gap-[16px]">
              <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[16px] bg-[#FFFFFF33]">
                <span className="font-chillax text-[16px] font-bold leading-[20px] tracking-[0px] text-white">
                  OSF
                </span>
              </div>

              <div className="min-w-0">
                <p className="m-0 h-[15px] font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-white/60">
                  Foundation · Partner since 2018
                </p>

                <h1 className="m-0 mt-[4px] h-[28px] font-chillax text-[20px] font-bold leading-[27.5px] tracking-[0px] text-white">
                  Open Society Foundations
                </h1>
              </div>
            </div>

            <div className="absolute left-[24px] top-[104px] flex items-center gap-[8px]">
              <span className="flex h-[24.5px] items-center justify-center rounded-full bg-[#FFFFFF33] px-[10px] py-[4px] font-inter text-[11px] font-semibold leading-[16.5px] tracking-[0.22px] text-white">
                Democracy
              </span>

              <span className="flex h-[24.5px] items-center justify-center rounded-full bg-[#FFFFFF33] px-[10px] py-[4px] font-inter text-[11px] font-semibold leading-[16.5px] tracking-[0.22px] text-white">
                Human Rights
              </span>

              <span className="flex h-[24.5px] items-center justify-center rounded-full bg-[#FFFFFF33] px-[10px] py-[4px] font-inter text-[11px] font-semibold leading-[16.5px] tracking-[0.22px] text-white">
                Justice
              </span>
            </div>
          </section>

          <section className="mt-[16px] h-[115px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[20px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <p className="m-0 h-[15px] font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
              About
            </p>

            <p className="m-0 h-[58px] w-full pt-[12px] font-inter text-[14px] font-normal leading-[22.75px] tracking-[0px] text-[#0E1726]">
              Open Society Foundations builds vibrant and tolerant democracies.
              OAK partnership covers digital rights and justice initiatives
              across Eastern Europe and Central Asia.
            </p>
          </section>

          <section className="mt-[16px] h-[113px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[20px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <p className="m-0 h-[15px] font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
              Contact at Convening
            </p>

            <div className="mt-[12px] flex h-[44px] items-center gap-[12px]">
              <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[16px] bg-[#162E55]">
                <span className="font-chillax text-[14px] font-bold leading-[20px] text-white">
                  MS
                </span>
              </div>

              <div>
                <p className="m-0 h-[20px] font-inter text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#0E1726]">
                  Maria Schmidt
                </p>

                <p className="m-0 h-[16px] font-inter text-[12px] font-normal leading-[16px] tracking-[0px] text-[#6B7590]">
                  m.schmidt@osf.org
                </p>
              </div>
            </div>
          </section>

          <a
            href="https://opensocietyfoundations.org"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:bg-[#244675] active:bg-[#102440] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#162E55] mt-[16px] flex h-[52px] w-full items-center justify-between rounded-[16px] bg-[#162E55] px-[20px] py-[16px] shadow-[0_4px_16px_0_#00000026]"
          >
            <div className="flex h-[20px] items-center gap-[8px]">
              <Globe
                className="h-[14px] w-[14px] shrink-0 text-white"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <span className="font-chillax text-[14px] font-semibold leading-[20px] tracking-[0px] text-white">
                Visit Website
              </span>
            </div>

            <ExternalLink
              className="h-[14px] w-[14px] shrink-0 text-white"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </a>

          <a
            href="mailto:m.schmidt@osf.org"
            className="transition-colors hover:bg-[#EEF1F5] active:bg-[#E0E5ED] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#162E55] mt-[12px] flex h-[54px] w-full items-center justify-between rounded-[24px] border border-[#1C2E5A1A] bg-white px-[20px] py-[16px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]"
          >
            <div className="flex h-[20px] items-center gap-[8px]">
              <Mail
                className="h-[15px] w-[15px] shrink-0 text-[#0E1726]"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <span className="font-inter text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#0E1726]">
                Send Message
              </span>
            </div>

            <ChevronRight
              className="h-[14px] w-[14px] shrink-0 text-[#6B7590]"
              strokeWidth={1.17}
              aria-hidden="true"
            />
          </a>
        </div>
      </main>
    </div>
  );
}
