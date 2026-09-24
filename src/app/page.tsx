import { publicMetadata } from '@/lib/seo';
export const metadata=publicMetadata('Partner Convening 2026', 'Register for the OAK Partner Convening, 9-11 November 2026 in Harare, Zimbabwe.', '/');
import RegistrationForm from '@/components/RegistrationForm/Registration';
export default function Home() {
  return <main className="portal-page"><header className="mb-6 rounded-3xl bg-[#162E55] p-7 text-white"><h1 className="font-chillax text-3xl font-bold">Partner Convening 2026</h1><p className="mt-2 text-white/75">9-11 November 2026 | Harare, Zimbabwe</p></header><RegistrationForm/></main>;
}
