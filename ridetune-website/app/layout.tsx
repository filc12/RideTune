import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, PLAY_URL } from "@/site.config";
import { LanguageProvider } from "@/i18n/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RideTune — The perfect suspension setup for your real ride",
    template: "%s — RideTune",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "motorcycle suspension setup",
    "suspension settings",
    "sag adjustment",
    "preload rebound compression",
    "motorcycle tyre pressure",
    "adventure bike suspension",
    "RideTune",
  ],
  authors: [{ name: "RideTune" }],
  creator: "RideTune",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: "RideTune — Motorcycle Suspension, Intelligent",
    description:
      "Every ride starts with the right setup. OEM-based suspension data, intelligent load calculations and tyre pressures — for your exact motorcycle.",
    images: [
      {
        url: "/img/hero.jpg",
        width: 1200,
        height: 630,
        alt: "RideTune — motorcycle suspension setup",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RideTune — Motorcycle Suspension, Intelligent",
    description:
      "Find your perfect motorcycle suspension setup. OEM data, smart calculations, real-world load. Buy once. Ride forever.",
    images: ["/img/hero.jpg"],
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "RideTune",
  operatingSystem: "Android",
  applicationCategory: "UtilitiesApplication",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/img/hero.jpg`,
  installUrl: PLAY_URL,
  offers: {
    "@type": "Offer",
    price: "14.99",
    priceCurrency: "EUR",
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
      <body className="min-h-full flex flex-col bg-brand-dark">
        {/* subtle premium film-grain overlay */}
        <div className="noise-overlay" aria-hidden />
        <LanguageProvider>{children}</LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
