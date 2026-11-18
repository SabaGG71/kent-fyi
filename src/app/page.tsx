import { Archive, Contact, Earlier, Georgia, Modeling, Press, Work, YouTube } from "@/components/kent/home";
import { ScrollIndex } from "@/components/kent/scroll-index";
import { SiteFooter } from "@/components/kent/site-footer";
import { SiteHeader } from "@/components/kent/site-header";

/** the index box's rows, in page order */
const SECTIONS = [
  { id: "work", label: "Intro" },
  { id: "next", label: "Next" },
  { id: "projects", label: "Projects" },
  { id: "georgia", label: "Georgia" },
  { id: "youtube", label: "YouTube" },
  { id: "earlier", label: "Earlier projects" },
  { id: "modeling", label: "Modeling" },
  { id: "press", label: "Features" },
  { id: "archive", label: "Archive" },
  { id: "contact", label: "Contact" },
];

/**
 * kent.fyi: Kent, briefly, what he'd like to work on next, then what he's working on now (WINE.FYI,
 * DINNER.FYI, KENT.FYI, LocalEyes), Georgia in photographs, YouTube, what came before (VOILA, Swift),
 * modeling, features, the image archive, and how to reach him. Black throughout; the
 * colour is in the photographs.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <ScrollIndex sections={SECTIONS} />
      <main id="main">
        <Work />
        <Georgia />
        <YouTube />
        <Earlier />
        <Modeling />
        <Press />
        <Archive />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
