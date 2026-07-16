import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Submission Terms",
  description:
    "Terms for sharing suspension setups to the RideTune community: your content, licence, moderation, removal and safety.",
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "article",
    url: "/terms",
    title: "Submission Terms — RideTune",
    description: "Terms for sharing setups to the RideTune community.",
  },
};

export default function Terms() {
  return <LegalPage kind="terms" />;
}
