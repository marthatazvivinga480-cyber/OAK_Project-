import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Globe,
  Layers3,
  UserRoundPlus,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-[#1C2E5A1A] bg-white">

      {/* Logo */}
      <div className="h-[130px] w-[255px] border-b border-[#1C2E5A1A] p-6">
        <Image
          src="/Logo-Oak-Foundation.svg"
          alt="OAK Foundation"
          width={85}
          height={53}
          className="h-[53px] w-[85px] object-contain"
          priority
        />

        <p className="h-7 w-[207px] pt-3 font-chillax text-xs font-semibold uppercase leading-4 tracking-[1.2px] text-[#6B7590]">
          Partner Convening 2026
        </p>
      </div>

      {/* Navigation */}
      <nav className="w-[255px] flex-1 p-4">
        {/* Register */}
        <Link
          href="/"
          className="
      flex
      h-11
      w-[223px]
      items-center
      gap-3
      rounded-2xl
      bg-[#162E55]
      px-4
      py-3
      font-[var(--font-inter)]
      text-[14px]
      font-semibold
      leading-5
      text-white
      shadow-[0_4px_20px_0_#1C2E5A4D]
    "
        >
          <UserRoundPlus className="h-[18px] w-[18px]" />
          <span>Register</span>
        </Link>

        {/* Programme */}
        <div className="h-12 w-[223px] pt-1">
          <Link
            href="/programme"
            className="
        flex
        h-11
        w-[223px]
        items-center
        gap-3
        rounded-2xl
        px-4
        py-3
        font-[var(--font-inter)]
        text-[14px]
        font-semibold
        leading-5
        text-[#6B7590]
      "
          >
            <CalendarDays
              className="h-[18px] w-[18px] text-[#6B7590]"
              strokeWidth={1.31}
            />
            <span>Programme</span>
          </Link>
        </div>

        {/* Partners */}
        <div className="h-12 w-[223px] pt-1">
          <Link
            href="/partners"
            className="
        flex
        h-11
        w-[223px]
        items-center
        gap-3
        rounded-2xl
        px-4
        py-3
        font-[var(--font-inter)]
        text-[14px]
        font-semibold
        leading-5
        text-[#6B7590]
      "
          >
            <Globe
              className="h-[18px] w-[18px] text-[#6B7590]"
              strokeWidth={1.31}
            />
            <span>Partners</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <footer className="h-[73px] w-[255px] border-t border-[#1C2E5A1A] p-5">
        <div className="flex h-8 w-[215px] items-center gap-2.5">

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF1F5]">
            <Globe className="h-[14px] w-[14px] text-[#6B7590]" />
          </div>

          <div className="font-[var(--font-inter)]">
            <p className="text-xs font-semibold leading-4 text-[#0E1726]">
              Harare, Zimbabwe
            </p>

            <p className="text-[10px] leading-[15px] text-[#6B7590]">
              9–11 March 2026
            </p>
          </div>

        </div>
      </footer>

    </aside>
  );
}