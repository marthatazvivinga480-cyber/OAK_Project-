import Image from "next/image";
import Link from "next/link";

import SectionLabel from "@/components/SectionLabel";

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-[256px] shrink-0 flex-col justify-between border-r border-[#1C2E5A]/10 bg-white px-1.5 py-[14px] pb-4 max-md:min-h-0 max-md:w-full max-md:flex-row max-md:items-center max-md:border-b max-md:border-r-0 max-md:px-4 max-md:py-3">
      <div className="w-full max-md:flex max-md:items-center max-md:gap-3">
        <div className="flex h-fit w-full flex-col items-start border-b border-[#1C2E5A]/10 pb-6 pl-5 max-md:border-0 max-md:pb-0 max-md:pl-0">
          <Image
            src="/Logo-Oak-Foundation.svg (1) 1 (2).svg"
            alt="OAK Foundation"
            width={85}
            height={53}
            className="h-auto w-full max-w-[85px]"
            priority
          />

          <SectionLabel className="max-md:hidden">
            Partner Convening 2026
          </SectionLabel>
        </div>

        <nav className="mt-[14px] max-md:mt-0">
          <Link
            href="/"
            className="flex min-h-[44px] w-full flex-row items-center justify-start gap-3 rounded-2xl bg-[#162E55] px-5 py-3 text-white shadow-[0_4px_16px_rgba(28,46,90,0.07)] transition hover:bg-[#1d3b6d] active:translate-y-px"
          >
            <span className="font-[Inter] text-[14px] font-semibold leading-[20px]">
              Register
            </span>
          </Link>
        </nav>
      </div>

      <div className="flex h-auto w-full flex-col border-t border-[#1C2E5A]/10 p-5 text-[10px] leading-[15px] text-[#6e7788] max-md:hidden">
        <div className="text-[#6B7590]">●</div>

        <div>
          <p className="font-[Inter] text-[12px] font-semibold leading-[16px] text-[#0E1726]">
            Harare, Zimbabwe
          </p>

          <span className="font-[Inter] text-[10px] font-normal leading-[15px] text-[#6B7590]">
            9–11 November 2026
          </span>
        </div>
      </div>
    </aside>
  );
}
