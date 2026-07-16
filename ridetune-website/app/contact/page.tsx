import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the RideTune team — questions, suggestions or a bike you'd like added. Email us or send a message.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact — RideTune",
    description: "Get in touch with the RideTune team.",
  },
};

export default function Contact() {
  return <ContactPage />;
}
