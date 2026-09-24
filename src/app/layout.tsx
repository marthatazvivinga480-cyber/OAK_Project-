import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader';
export const metadata: Metadata = { title: { default: 'OAK Partner Convening 2026', template: '%s | OAK Foundation' }, description: 'Register, explore the programme and connect with partners at the OAK Partner Convening in Harare.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><a className="sr-only focus:not-sr-only" href="#content">Skip to content</a><Sidebar/><div className="min-h-screen pb-24 md:pl-[255px] md:pb-0"><MobileHeader/><div id="content">{children}</div></div></body></html>;
}
