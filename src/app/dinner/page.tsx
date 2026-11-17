import type { Metadata } from "next";
import { ProjectPage } from "@/components/kent/project-page";
import { DINNER_PAGE, SHARE_CARD as card } from "@/lib/kent";

const title = "DINNER.FYI · kent.fyi";
const description = DINNER_PAGE.description[1];

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: "/dinner", siteName: "kent.fyi", type: "website", locale: "en_US", images: [card] },
  twitter: { card: "summary_large_image", title, description, images: [card] },
};

/** DINNER.FYI: the format, No. 1, and the next one */
export default function Dinner() {
  return <ProjectPage page={DINNER_PAGE} />;
}
