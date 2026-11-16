import { Footnotes } from "@/components/kent/footnotes";
import { GameSection } from "@/components/kent/game-section";
import { Hero } from "@/components/kent/hero";
import { Play } from "@/components/kent/play";
import { SiteFooter } from "@/components/kent/site-footer";
import { SiteHeader } from "@/components/kent/site-header";

/**
 * kent.fyi: for your information. A list of things worth knowing about Kent, each printed live through
 * his own marble, then the footnotes that back each one up, his portrait set in all of it, a game, then how
 * to reach him.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Footnotes />
        <Play />
        <GameSection />
      </main>
      <SiteFooter />
    </>
  );
}
