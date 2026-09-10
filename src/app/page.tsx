import RegistrationForm from "@/components/RegistrationForm/Registration";
import Image from "next/image";
import Link from "next/link";
import { Globe, UserRoundPlus } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-[#F7F8FA] max-md:flex-col">
      <aside className="flex min-h-screen w-64 shrink-0 max-md:min-h-0 max-md:w-full flex-col border-r border-[#1C2E5A1A] bg-white">
        <div className="h-[130px] w-[255px] border-b border-[#1C2E5A1A] p-6">
          <Image
            src="/Logo-Oak-Foundation.svg (1) 1 (2).svg"
            alt="OAK Foundation"
            width={85}
            height={53}
            className="h-[53px] w-[85px] object-contain"
            priority
          />

          <p className="h-7 w-[207px] pt-3 text-xs font-semibold uppercase leading-4 tracking-[1.2px] text-[#6B7590]">
            Partner Convening 2026
          </p>
        </div>

        <nav className="w-[255px] flex-1 p-4">
          <Link
            href="/"
            aria-current="page"
            className="flex h-11 w-[223px] items-center gap-3 rounded-2xl bg-[#162E55] px-4 py-3 text-sm font-semibold leading-5 text-white shadow-[0_4px_20px_0_#1C2E5A4D]"
          >
            <UserRoundPlus
              className="h-[18px] w-[18px] shrink-0"
              aria-hidden="true"
            />

            <span>Register</span>
          </Link>
        </nav>

        <footer className="h-[73px] w-[255px] border-t border-[#1C2E5A1A] p-5">
          <div className="flex h-8 w-[215px] items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EEF1F5]">
              <Globe
                className="h-[14px] w-[14px] text-[#6B7590]"
                aria-hidden="true"
              />
            </div>

            <div className="font-[var(--font-inter)]">
              <p className="h-4 text-xs font-semibold leading-4 tracking-normal text-[#0E1726]">
                Harare, Zimbabwe
              </p>

              <p className="h-[15px] text-[10px] font-normal leading-[15px] tracking-normal text-[#6B7590]">
                9–11 November 2026
              </p>
            </div>
          </div>
        </footer>
      </aside>

      <section className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[672px] px-8 py-10 max-md:px-4">
          <header className="rounded-3xl bg-[#162E55] p-6 text-white">
            <h1 className="font-chillax text-[30px] font-bold leading-[37.5px]">
              Partner<br />Convening 2026
            </h1>
            <p className="mt-2 font-inter text-sm text-white/75">
              9–11 November 2026 · Harare, Zimbabwe
            </p>
          </header>
          <section aria-labelledby="registration-heading" className="mt-6 rounded-2xl border border-[#e3e7ec] bg-white p-6 font-inter text-[#16243a] max-sm:p-4">
            <h2 id="registration-heading" className="mb-6 text-xl font-semibold">Register for the convening</h2>
            <RegistrationForm />
          </section>
        </div>
      </section>
    </main>
  );
}