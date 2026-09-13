"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Globe,
  Grid2X2,
  ScanLine,
  UserPlus,
} from "lucide-react";

type NavigationItem = {
  label: string;
  href: string;
  icon: typeof ScanLine;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Register",
    href: "/register",
    icon: UserPlus,
  },
  {
    label: "Check In",
    href: "/checkin",
    icon: ScanLine,
  },
  {
    label: "Programme",
    href: "/programme",
    icon: CalendarDays,
  },
  {
    label: "Partners",
    href: "/partners",
    icon: Globe,
  },
  {
    label: "Attendance",
    href: "/attendance",
    icon: Grid2X2,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const attendeeNavigation: NavigationItem[] = navigationItems.filter(
    (item) =>
      item.href === "/register" ||
      item.href === "/programme" ||
      item.href === "/partners"
  );

  const checkInNavigation: NavigationItem[] = navigationItems.filter(
    (item) =>
      item.href === "/checkin" ||
      item.href === "/programme" ||
      item.href === "/partners" ||
      item.href === "/attendance"
  );

  const attendanceNavigation = navigationItems;

  const isCheckInArea =
    pathname === "/checkin" ||
    pathname?.startsWith("/checkin/");

  const isAttendanceArea = pathname === "/attendance";

  const mobileNavigation = isAttendanceArea
    ? attendanceNavigation
    : isCheckInArea
      ? checkInNavigation
      : attendeeNavigation;

  const desktopNavigation = navigationItems;

  function isActive(href: string) {
    if (href === "/register") {
      return (
        pathname === "/" ||
        pathname === "/register" ||
        pathname?.startsWith("/registration-preview") ||
        pathname?.startsWith("/qr-code")
      );
    }

    return (
      pathname === href ||
      pathname?.startsWith(`${href}/`)
    );
  }

  return (
    <>
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}

      <div className="hidden w-[255px] min-w-[255px] shrink-0 overflow-hidden md:block">
        <aside
          className="
            fixed
            inset-y-0
            left-0
            z-40
            flex
            h-screen
            w-[255px]
            max-w-[255px]
            flex-col
            overflow-x-hidden
            overflow-y-auto
            border-r
            border-[#1C2E5A1A]
            bg-white
          "
        >
          {/* SIDEBAR HEADER */}

          <div
            className="
              h-[130px]
              w-full
              shrink-0
              border-b
              border-[#1C2E5A1A]
              p-6
            "
          >
            <Link href="/register" className="block w-fit">
              <Image
                src="/Logo-Oak-Foundation.svg (1) 1 (2).svg"
                alt="OAK Foundation"
                width={85}
                height={53}
                className="h-[53px] w-[85px] object-contain"
                priority
              />
            </Link>

            <p
              className="
                h-7
                pt-3
                font-inter
                text-xs
                font-bold
                uppercase
                leading-4
                tracking-[1.2px]
                text-[#6B7590]
              "
            >
              Partner Convening 2026
            </p>
          </div>

          {/* SIDEBAR NAVIGATION */}

          <nav
            aria-label="Desktop navigation"
            className="
              flex-1
              overflow-x-hidden
              overflow-y-auto
              p-4
            "
          >
            {desktopNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <div
                  key={item.href}
                  className="
                    h-12
                    w-[223px]
                    max-w-full
                    pt-1
                    first:pt-0
                  "
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`
                      flex
                      h-11
                      w-[223px]
                      max-w-full
                      items-center
                      gap-3
                      rounded-2xl
                      px-4
                      py-3
                      font-[var(--font-inter)]
                      text-[14px]
                      font-bold
                      leading-5
                      no-underline
                      ${
                        active
                          ? "bg-[#162E55] text-white shadow-[0_4px_20px_0_#1C2E5A4D]"
                          : "bg-transparent text-[#6B7590]"
                      }
                    `}
                  >
                    <Icon
                      className="h-[18px] w-[18px] shrink-0"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />

                    <span>{item.label}</span>
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* SIDEBAR FOOTER */}

          <footer
            className="
              h-[73px]
              w-full
              shrink-0
              border-t
              border-[#1C2E5A1A]
              p-5
            "
          >
            <div className="flex h-8 min-w-0 items-center gap-2.5">
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#EEF1F5]
                "
              >
                <Globe
                  className="h-[14px] w-[14px] text-[#6B7590]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    font-inter
                    text-[12px]
                    font-bold
                    leading-4
                    text-[#0E1726]
                  "
                >
                  Harare, Zimbabwe
                </p>

                <p
                  className="
                    truncate
                    font-inter
                    text-[10px]
                    font-normal
                    leading-[15px]
                    text-[#6B7590]
                  "
                >
                  9–11 November 2026
                </p>
              </div>
            </div>
          </footer>
        </aside>
      </div>

      {/* =========================================================
          MOBILE BOTTOM NAVIGATION
      ========================================================= */}

      <nav
        aria-label="Mobile navigation"
        className="
          fixed
          inset-x-0
          bottom-0
          z-50
          flex
          min-h-[61px]
          w-full
          max-w-full
          items-center
          overflow-hidden
          border-t
          border-[#FFFFFF8C]
          bg-[#FFFFFFC2]
          px-[4px]
          py-[6px]
          backdrop-blur-[20px]
            md:hidden
          "
        >
          {mobileNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`
                  flex
                  h-[46px]
                  min-w-0
                  flex-1
                  flex-col
                  items-center
                  justify-center
                  gap-[2px]
                  overflow-hidden
                  rounded-[12px]
                  px-[2px]
                  py-[6px]
                  text-center
                  no-underline
                  ${
                    active
                      ? "text-[#162E55]"
                      : "text-[#6B7590]"
                  }
                `}
              >
                <span
                  className={`
                    flex
                    h-[19px]
                    w-[19px]
                    shrink-0
                    items-center
                    justify-center
                    ${
                      active
                        ? "text-[#162E55]"
                        : "text-[#6B7590]"
                    }
                  `}
                >
                  <Icon
                    className="h-[19px] w-[19px]"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </span>

                <span
                  className={`
                    whitespace-nowrap
                    font-inter
                    text-[9px]
                    font-bold
                    leading-[14px]
                    tracking-[0.22px]
                    ${
                      active
                        ? "text-[#162E55]"
                        : "text-[#6B7590]"
                    }
                  `}
                >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}