"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function MobileHeader() {
  const pathname = usePathname();

  /*
   * Do not show the attendee event header on admin pages.
   * All public/event pages receive the header automatically.
   */
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    return null;
  }

  return (
    <header
      className="
        flex
        h-[82px]
        w-full
        flex-row
        items-center
        gap-[12px]
        bg-[#162E55]
        px-[16px]
        pb-[16px]
        pl-[58px]
        pt-[38px]
        md:hidden
      "
    >
      {/* OAK Foundation Logo */}
      
<Image
  src="/logo-oak-foundation-white.png"
  alt="OAK Foundation"
  width={45}
  height={28}
  className="h-[28px] w-[45px] shrink-0 object-cover"
/>

      {/* Vertical Divider */}
      <div
        aria-hidden="true"
        className="
          h-[20px]
          w-px
          shrink-0
          bg-[#FFFFFF33]
        "
      />

      {/* Event Name */}
      <p
        className="
          m-0
          whitespace-nowrap
          font-[Avenir_Next_LT_Pro,Arial,sans-serif]
          text-[12px]
          font-normal
          uppercase
          leading-[16px]
          tracking-[1.2px]
          text-[#FFFFFFB2]
        "
      >
        Partner Convening 2026
      </p>
    </header>
  );
}