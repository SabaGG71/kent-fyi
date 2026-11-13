import type { Metadata } from "next";
import { ABOUT, EMAIL, INSTAGRAM, MANAGER, MODELING, PODCASTS, VOILA } from "@/lib/kent";
import { Out } from "@/components/kent/footnotes";
import { SiteFooter } from "@/components/kent/site-footer";
import { SiteHeader } from "@/components/kent/site-header";

export const metadata: Metadata = {
  title: "About · kent.fyi",
  description: "Kent Sheridan: a coffee cart in 2014, then VOILA, Swift and LocalEyes Growth. Now in Tbilisi, modeling, acting and restarting the Lunar Society.",
};

const label = "mono text-ink/55";

/**
 * About, after JJJJound's: one narrow column of plain paragraphs in the middle of the page, then the
 * particulars underneath as lists, the way Benjamin Edgar keeps his.
 */
export default function About() {
  return (
    <>
      <SiteHeader current="about" />
      <main id="main" className="px-(--m) pt-[clamp(64px,12svh,140px)]">
        <article className="mx-auto max-w-[620px] text-[15px] leading-[1.55]">
          <h1 className="font-medium">About</h1>
          <div className="mt-3 space-y-[1.1em]">
            {ABOUT.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            <section>
              <h2 className={label}>VOILA, written up in</h2>
              <ul className="mt-2 space-y-1">
                {VOILA.press.map((l) => (
                  <li key={l.label}>{l.href ? <Out href={l.href}>{l.label}</Out> : l.label}</li>
                ))}
                <li>
                  <Out href={VOILA.score.href}>Coffee Review, 90 points</Out>
                </li>
              </ul>
            </section>
            <section>
              <h2 className={label}>Modeling and acting</h2>
              <ul className="mt-2 space-y-1">
                {MODELING.projects.map((p) => (
                  <li key={p.name}>{p.name}</li>
                ))}
              </ul>
            </section>
            <section className="sm:col-span-2">
              <h2 className={label}>Podcasts</h2>
              <ul className="mt-2 space-y-1">
                {PODCASTS.map((p) => (
                  <li key={p.id}>
                    <span className="text-ink/55">{p.show}.</span> <Out href={`https://www.youtube.com/watch?v=${p.id}`}>{p.title}</Out>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className={label}>Contact</h2>
              <p className="mt-2">
                <a href={`mailto:${EMAIL}`} className="text-link underline decoration-1 underline-offset-[3px]">
                  {EMAIL}
                </a>
              </p>
            </section>
            <section>
              <h2 className={label}>Management</h2>
              <p className="mt-2">
                <a href={`mailto:${MANAGER}`} className="text-link underline decoration-1 underline-offset-[3px]">
                  {MANAGER}
                </a>
                <br />
                <Out href={INSTAGRAM}>@kent.fyi</Out>
              </p>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
