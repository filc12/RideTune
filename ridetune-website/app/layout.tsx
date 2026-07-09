import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RideTune — The perfect suspension setup for your real ride",
  description:
    "RideTune finds your perfect motorcycle suspension setup using OEM data, intelligent calculations and the real-world way you ride. Buy once. Ride forever.",
  openGraph: {
    title: "RideTune — Motorcycle Suspension, Intelligent",
    description:
      "Every ride starts with the right setup. OEM-based suspension data for 100+ motorcycles.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-dark">{children}</body>
    </html>
  );
}
