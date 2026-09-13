import RegistrationForm from "@/components/RegistrationForm/Registration";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar />

      <section className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[672px] px-8 py-10 max-md:px-4">
          <header className="relative flex h-[167px] w-full flex-col overflow-hidden rounded-3xl bg-[#162E55] p-6 text-white shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 z-0 h-48 w-48 rounded-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(168,187,206,0.4) 0%, rgba(168,187,206,0) 70%)",
              }}
            />

            <div className="relative z-10 flex flex-col">
              <div className="pt-4">
                <h1 className="font-chillax text-[30px] font-bold leading-[38px]">
                  Partner
                  <br />
                  Convening 2026
                </h1>
              </div>

              <div className="pt-2">
                <p className="font-inter text-sm leading-5 text-white/50">
                  9–11 November 2026 · Harare, Zimbabwe
                </p>
              </div>
            </div>
          </header>

          <div className="font-inter text-[#16243a]">
            <RegistrationForm />
          </div>
        </div>
      </section>
    </main>
  );
}