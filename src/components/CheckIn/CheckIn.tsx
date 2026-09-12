"use client";

import { useState } from "react";
import { ScanLine } from "lucide-react";

import Sidebar from "@/components/Sidebar";

type AttendeeRole =
  | "Partner"
  | "OAK Staff"
  | "Coordination Team";

type Attendee = {
  initials: string;
  name: string;
  code: string;
  role: AttendeeRole;
};

const ATTENDEES: Attendee[] = [
  {
    initials: "MS",
    name: "Maria Schmidt",
    code: "OAK-2026-7842-XKPH",
    role: "Partner",
  },
  {
    initials: "JO",
    name: "James Odhiambo",
    code: "OAK-2026-1193-JWQA",
    role: "OAK Staff",
  },
  {
    initials: "AD",
    name: "Awa Diallo",
    code: "OAK-2026-3310-ADGE",
    role: "Coordination Team",
  },
  {
    initials: "FZB",
    name: "Fatima Z. Benali",
    code: "OAK-2026-5592-FWBN",
    role: "Partner",
  },
];

export default function CheckIn() {
  const [manualCode, setManualCode] = useState("");

  function handleSimulatedScan(attendee: Attendee) {
    setManualCode(attendee.code);
  }

  function handleManualCheck() {
    const code = manualCode.trim();

    if (!code) return;

    console.log("Checking attendee:", code);
  }

  return (
    <div className="flex min-h-[1394px] bg-[#F4F5F7] max-md:flex-col">
      <Sidebar />

      <main className="min-h-[1394px] min-w-0 flex-1 bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[672px] px-[32px] py-[40px] max-sm:px-[16px]">
          <div className="h-[56px] w-full">
            <h1 className="m-0 h-[32px] w-full font-chillax text-[24px] font-bold leading-[32px] tracking-[0px] text-[#0E1726]">
              Event Check-In
            </h1>

            <p className="m-0 h-[24px] w-full pt-[4px] font-inter text-[14px] font-normal leading-[20px] tracking-[0px] text-[#6B7590]">
              Scan an attendee QR code to check them in
            </p>
          </div>

          <div className="mt-[16px] h-[673px] w-full overflow-hidden rounded-[24px] bg-[#0E1726] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div className="relative h-[608px] w-full overflow-hidden">
              <div
                id="qr-reader"
                className="absolute inset-0 h-full w-full"
              />

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70.71%_70.71%_at_50%_50%,rgba(168,187,206,0.8)_0.16%,rgba(0,0,0,0)_0.16%)] opacity-[0.07]" />

              <div className="pointer-events-none absolute left-1/2 top-[198.17px] h-[211.664px] w-[211.664px] -translate-x-1/2 rounded-full bg-[radial-gradient(70.71%_70.71%_at_50%_50%,rgba(168,187,206,0.12)_0%,rgba(168,187,206,0)_70%)] opacity-[0.44]" />

              <div className="pointer-events-none absolute left-1/2 top-[198.17px] h-[211.664px] w-[211.664px] -translate-x-1/2">
                <span className="absolute left-0 top-0 h-[16px] w-[16px] rounded-tl-[5px] border-l border-t border-[#A8BBCE]" />

                <span className="absolute right-0 top-0 h-[16px] w-[16px] rounded-tr-[5px] border-r border-t border-[#A8BBCE]" />

                <span className="absolute bottom-0 left-0 h-[16px] w-[16px] rounded-bl-[5px] border-b border-l border-[#A8BBCE]" />

                <span className="absolute bottom-0 right-0 h-[16px] w-[16px] rounded-br-[5px] border-b border-r border-[#A8BBCE]" />
              </div>

              <p className="pointer-events-none absolute left-1/2 top-[572px] m-0 h-[16px] w-[203px] -translate-x-1/2 whitespace-nowrap text-center font-inter text-[12px] font-normal leading-[16px] tracking-[0.3px] text-[#A8BBCE]/50">
                Position QR code within the frame
              </p>
            </div>

            <div className="flex h-[65px] w-full items-center gap-[12px] border-t border-[#FFFFFF1A] p-[16px]">
              <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#FFFFFF1A]">
                <ScanLine
                  className="h-[14px] w-[14px] text-[#A8BBCE]"
                  strokeWidth={1.31}
                  aria-hidden="true"
                />
              </div>

              <p className="m-0 h-[16px] whitespace-nowrap font-inter text-[12px] font-normal leading-[16px] text-[#A8BBCE]/45 max-sm:whitespace-normal">
                Hold camera steady · Auto-scans in 1–2 seconds
              </p>
            </div>
          </div>

          <div className="mt-[16px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[20px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <p className="m-0 h-[15px] w-full font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
              Simulate QR Scan
            </p>

            <div className="mt-[12px] w-full space-y-[8px]">
              {ATTENDEES.map((attendee) => (
                <button
                  key={attendee.code}
                  type="button"
                  onClick={() => handleSimulatedScan(attendee)}
                  className="flex min-h-[62px] w-full items-center gap-[12px] rounded-[16px] border border-[#1C2E5A1A] bg-white p-[12px] text-left outline-none focus:outline-none focus:ring-0"
                >
                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[12px] bg-[#162E55] font-inter text-[12px] font-bold leading-[16px] text-white">
                    {attendee.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="m-0 h-[20px] truncate font-inter text-[14px] font-medium leading-[20px] tracking-[0px] text-[#0E1726]">
                      {attendee.name}
                    </p>

                    <p className="m-0 truncate font-mono text-[10px] font-normal leading-[15px] tracking-[0px] text-[#6B7590]">
                      {attendee.code}
                    </p>
                  </div>

                  <RoleBadge role={attendee.role} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-[16px] w-full rounded-[24px] border border-[#1C2E5A1A] bg-white p-[20px] shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <p className="m-0 font-inter text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#6B7590]">
              Manual Code Entry
            </p>

            <div className="mt-[12px] flex w-full gap-[8px] max-sm:flex-col">
              <input
                type="text"
                value={manualCode}
                onChange={(event) =>
                  setManualCode(event.target.value)
                }
                placeholder="OAK-2026-XXXX-XXXX"
                className="
                  h-[52.5px]
                  min-w-0
                  flex-1
                  rounded-[14px]
                  border
                  border-[#1C2E5A1A]
                  bg-[#EEF1F5]
                  px-[16px]
                  py-[14px]
                  font-inter
                  text-[15px]
                  font-normal
                  leading-[18px]
                  tracking-[0px]
                  text-[#0E1726]
                  outline-none
                  placeholder:text-[#6B7590]
                  focus:border-[#162E55]
                  focus:outline-none
                  focus:ring-0
                "
              />

              <button
                type="button"
                onClick={handleManualCheck}
                className="
                  flex
                  h-[52.5px]
                  w-[90px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-[16px]
                  bg-[#162E55]
                  px-[20px]
                  py-[14px]
                  font-chillax
                  text-[16px]
                  font-semibold
                  leading-[24px]
                  tracking-[0px]
                  text-white
                  shadow-[0_4px_20px_0_#1C2E5A4D]
                  transition
                  hover:bg-[#1C3A6B]
                  active:scale-[0.98]
                  max-sm:w-full
                "
              >
                Check
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function RoleBadge({
  role,
}: {
  role: AttendeeRole;
}) {
  if (role === "OAK Staff") {
    return (
      <div className="flex h-[27px] w-[86px] shrink-0 items-center justify-center gap-[4px] rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-[10px] py-[4px]">
        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#10B981]" />

        <span className="whitespace-nowrap font-inter text-[11px] font-semibold leading-[16.5px] tracking-[0.22px] text-[#065F46]">
          OAK Staff
        </span>
      </div>
    );
  }

  if (role === "Coordination Team") {
    return (
      <div className="flex h-[27px] shrink-0 items-center justify-center gap-[4px] rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-[10px] py-[4px]">
        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#F97316]" />

        <span className="whitespace-nowrap font-inter text-[11px] font-semibold leading-[16.5px] tracking-[0.22px] text-[#C2410C]">
          Coordination Team
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-[27px] w-[74px] shrink-0 items-center justify-center gap-[4px] rounded-full border border-[#C5CFDF] bg-[#EEF1F9] px-[10px] py-[4px]">
      <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#1C2E5A]" />

      <span className="whitespace-nowrap font-inter text-[11px] font-semibold leading-[16.5px] tracking-[0.22px] text-[#1C2E5A]">
        Partner
      </span>
    </div>
  );
}
