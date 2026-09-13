import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import MobileHeader from "@/components/MobileHeader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OAK Zimbabwe Partner Gathering",
  description:
    "Registration platform for the OAK Zimbabwe Partner Gathering 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
    >
      <body
        className="
          min-h-screen
          font-chillax
          antialiased
        "
      >
        <MobileHeader />
        {children}
      </body>
    </html>
  );
}