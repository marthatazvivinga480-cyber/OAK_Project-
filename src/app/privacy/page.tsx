import { publicMetadata } from '@/lib/seo';
export const metadata=publicMetadata('Privacy notice', 'How registration information is used for the OAK Partner Convening 2026.', '/privacy');


export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen bg-[#F7F8FA] pb-[80px] md:pb-0">


      <section className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[672px] px-8 py-10 max-md:px-4">
          <header className="rounded-3xl bg-[#162E55] p-6 text-white shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <h1 className="font-chillax text-[28px] font-bold leading-tight">
              Privacy Policy
            </h1>
            <p className="mt-2 font-inter text-sm text-white/75">
              OAK Partner Convening 2026 · Data Protection Notice
            </p>
          </header>

          <div className="mt-6 rounded-3xl border border-[#1C2E5A1A] bg-white p-6 shadow-[0_4px_16px_0_#1C2E5A12,0_1px_3px_0_#1C2E5A0D]">
            <div className="space-y-4 font-inter text-sm leading-relaxed text-[#4A5568]">
              <p>
                The OAK Foundation is committed to protecting your personal data in accordance with applicable data privacy regulations, including GDPR.
              </p>

              <h2 className="pt-2 font-chillax text-base font-semibold text-[#0E1726]">
                Information We Collect
              </h2>
              <p>
                When you register for the OAK Partner Convening 2026, we collect your name, organizational affiliation, email address, phone number, and any special accommodation or dietary requirements you voluntarily disclose.
              </p>

              <h2 className="pt-2 font-chillax text-base font-semibold text-[#0E1726]">
                How We Use Your Data
              </h2>
              <p>
                Your data is used exclusively to facilitate event organization, issue your attendee badge and QR code entry pass, arrange catering and logistics, and coordinate session participation.
              </p>

              <h2 className="pt-2 font-chillax text-base font-semibold text-[#0E1726]">
                Data Retention & Security
              </h2>
              <p>
                Your registration information is stored securely and is retained only for the duration required to deliver convening activities and fulfill post-event reporting requirements.
              </p>

              <h2 className="pt-2 font-chillax text-base font-semibold text-[#0E1726]">
                Contact
              </h2>
              <p>
                For questions regarding your registration data or to request data correction, please contact the convening coordination team.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
