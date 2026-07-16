import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How RideTune handles your data: no accounts, local-first storage, anonymous analytics and crash reports only.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "article",
    url: "/privacy",
    title: "Privacy Policy — RideTune",
    description: "How RideTune handles your data.",
  },
};

export default function Privacy() {
  return <LegalPage kind="privacy" />;
}
