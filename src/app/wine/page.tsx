import type { Metadata } from "next";
import { ProjectPage } from "@/components/kent/project-page";
import { WINE_PAGE, SHARE_CARD as card } from "@/lib/kent";

const title = "WINE.FYI · kent.fyi";
const description = WINE_PAGE.description[0];

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: "/wine", siteName: "kent.fyi", type: "website", locale: "en_US", images: [card] },
  twitter: { card: "summary_large_image", title, description, images: [card] },
};

/** WINE.FYI: the wine, the grape, and where to buy it */
export default function Wine() {
  return <ProjectPage page={WINE_PAGE} />;
}
