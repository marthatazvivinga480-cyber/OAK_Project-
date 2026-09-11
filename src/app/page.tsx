import RegistrationForm from "@/components/RegistrationForm/Registration";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-[#F7F8FA] max-md:flex-col">
      <Sidebar />

      <section className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[672px] px-8 py-10 max-md:px-4">
          <header className="rounded-3xl bg-[#162E55] p-6 text-white">
            <h1 className="font-chillax text-[30px] font-bold leading-[37.5px]">
              Partner
              <br />
              Convening 2026
            </h1>
            <p className="mt-2 font-inter text-sm text-white/75">
              9–11 November 2026 · Harare, Zimbabwe
            </p>
          </header>

          <section
            aria-labelledby="registration-heading"
            className="mt-6 rounded-2xl border border-[#e3e7ec] bg-white p-6 font-inter text-[#16243a] max-sm:p-4"
          >
            <h2 id="registration-heading" className="mb-6 text-xl font-semibold">
              Register for the convening
            </h2>
            <RegistrationForm />
          </section>
        </div>
      </section>
    </main>
  );
}