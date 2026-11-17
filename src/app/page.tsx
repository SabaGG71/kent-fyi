import { About, Archive, Contact, Earlier, Georgia, Modeling, Press, Work } from "@/components/kent/home";
import { SiteFooter } from "@/components/kent/site-footer";
import { SiteHeader } from "@/components/kent/site-header";

/**
 * kent.fyi: Kent, briefly, then what he's working on now (WINE.FYI, DINNER.FYI, KENT.FYI, LocalEyes),
 * Georgia in photographs, what came before (VOILA, Swift), modeling and acting, about, features and
 * podcasts, the image archive, and how to reach him. Black throughout; the colour is in the photographs.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Work />
        <Georgia />
        <Earlier />
        <Modeling />
        <About />
        <Press />
        <Archive />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
