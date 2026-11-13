import type { Metadata } from "next";
import { RunSection } from "@/components/kent/run/section";
import { SiteFooter } from "@/components/kent/site-footer";
import { SiteHeader } from "@/components/kent/site-header";

export const metadata: Metadata = {
  title: "Supra Run · kent.fyi",
  description: "Kent is late for dinner in Tbilisi. Pick up four Georgian words on the way.",
  robots: { index: false },
};

/** Supra Run on a page of its own, kept as an earlier version of the home page's P.S. */
export default function Run() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <RunSection />
      </main>
      <SiteFooter />
    </>
  );
}
