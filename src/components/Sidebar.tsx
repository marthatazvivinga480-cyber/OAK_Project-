"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Globe, Grid2X2, ScanLine } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Check In", href: "/checkin", icon: ScanLine },
    { label: "Programme", href: "/programme", icon: CalendarDays },
    { label: "Partners", href: "/partners", icon: Globe },
    { label: "Attendance", href: "/attendance", icon: Grid2X2 },
  ];

  return (
    <aside className="flex min-h-screen w-[255px] shrink-0 flex-col border-r border-[#1C2E5A1A] bg-white max-md:min-h-0 max-md:w-full max-md:flex-row max-md:items-center max-md:border-b max-md:border-r-0 max-md:px-4 max-md:py-2">
      <div className="h-[130px] w-full border-b border-[#1C2E5A1A] p-6 max-md:h-auto max-md:w-auto max-md:border-b-0 max-md:border-r max-md:border-[#1C2E5A1A] max-md:p-0 max-md:pr-4">
        <Image
          src="/Logo-Oak-Foundation.svg (1) 1 (2).svg"
          alt="OAK Foundation"
          width={85}
          height={53}
          className="h-[53px] w-[85px] object-contain max-md:h-[36px] max-md:w-[58px]"
          priority
        />
        <p className="h-7 pt-3 font-chillax text-xs font-semibold uppercase leading-4 tracking-[1.2px] text-[#6B7590] max-md:hidden">
          Partner Convening 2026
        </p>
      </div>

      <nav className="flex-1 p-4 max-md:flex max-md:flex-1 max-md:items-center max-md:gap-1 max-md:overflow-x-auto max-md:p-0 max-md:pl-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <div key={item.href} className="h-12 w-[223px] pt-1 first:pt-0 max-md:h-auto max-md:w-auto max-md:shrink-0 max-md:pt-0">
              <Link
                href={item.href}
                className={`flex h-11 w-[223px] items-center gap-3 rounded-2xl px-4 py-3 font-[var(--font-inter)] text-[14px] font-semibold leading-5 transition-none active:scale-[0.98] active:bg-[#102440] active:text-white active:shadow-inner max-md:h-9 max-md:w-auto max-md:gap-2 max-md:px-3 max-md:py-2 max-md:text-[12px] ${
                  isActive ? "bg-[#162E55] text-white shadow-[0_4px_20px_0_#1C2E5A4D]" : "bg-transparent text-[#6B7590]"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0 max-md:h-4 max-md:w-4" strokeWidth={1.31} />
                <span className="max-md:hidden sm:max-md:inline">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      <footer className="h-[73px] w-full border-t border-[#1C2E5A1A] p-5 max-md:hidden">
        <div className="flex h-8 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EEF1F5]">
            <Globe className="h-[14px] w-[14px] text-[#6B7590]" strokeWidth={1.31} />
          </div>
          <div className="font-[var(--font-inter)]">
            <p className="m-0 text-xs font-semibold leading-4 text-[#0E1726]">Harare, Zimbabwe</p>
            <p className="m-0 text-[10px] leading-[15px] text-[#6B7590]">9–11 November 2026</p>
          </div>
        </div>
      </footer>
    </aside>
  );
}