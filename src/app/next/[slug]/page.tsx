import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Out, SectionHead } from "@/components/kent/links";
import { SiteFooter } from "@/components/kent/site-footer";
import { SiteHeader } from "@/components/kent/site-header";
import { EMAIL, NEXT, SHARE_CARD as card } from "@/lib/kent";

/** straight into a DM with Kent on Instagram */
const INSTAGRAM_DM = "https://ig.me/m/kent.fyi";

/** only the ideas with a page of their own */
const PAGES = NEXT.filter((i) => i.page);

export function generateStaticParams() {
  return PAGES.map((idea) => ({ slug: idea.slug }));
}

export async function generateMetadata({ params }: PageProps<"/next/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const idea = PAGES.find((i) => i.slug === slug);
  if (!idea) return {};
  const title = `${idea.title} · kent.fyi`;
  const description = idea.short;
  return {
    title,
    description,
    openGraph: { title, description, url: `/next/${slug}`, siteName: "kent.fyi", type: "website", locale: "en_US", images: [card] },
    twitter: { card: "summary_large_image", title, description, images: [card] },
  };
}

/**
 * An idea Kent would like to work on, laid out simply, in his words: the idea, its parts under plain headings,
 * the references one under the other with a short caption, how to get in touch, then the next idea.
 */
export default function IdeaPage({ params }: PageProps<"/next/[slug]">) {
  return (
    <>
      <SiteHeader />
      {/* the URL is read inside the boundary, so the header and footer are in the instant shell */}
      <Suspense fallback={<main id="main" className="min-h-svh" />}>
        <Idea params={params} />
      </Suspense>
      <SiteFooter />
    </>
  );
}

async function Idea({ params }: { params: PageProps<"/next/[slug]">["params"] }) {
  const { slug } = await params;
  const at = NEXT.findIndex((i) => i.slug === slug);
  const idea = NEXT[at];
  if (!idea?.page) notFound();
  const page = idea.page;
  const next = PAGES[(PAGES.indexOf(idea) + 1) % PAGES.length];

  return (
      <main id="main" className="px-(--m) pt-[clamp(28px,5svh,64px)] pb-[clamp(72px,9vw,140px)]">
        <p className="t-small">
          <Link href="/#next" className="text-fg/70 hover:text-hover">
            <span aria-hidden>&larr;&nbsp;</span>I would like to
          </Link>
        </p>

        <article className="mt-[clamp(28px,4vw,56px)] max-w-[760px]">
          <p className="t-label text-fg/65">
            I would like to · {String(at + 1).padStart(2, "0")}
          </p>
          <h1 className="t-display mt-2 animate-[rise_900ms_var(--ease-out-expo)_both] text-balance">{idea.title}</h1>
          <div className="t-lead mt-6 space-y-4 text-fg/85">
            {page.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {page.sections.map((s, i) => (
            <section key={s.title} aria-labelledby={`part-${i}`} className="mt-[clamp(40px,5vw,64px)]">
              <SectionHead id={`part-${i}`}>{s.title}</SectionHead>
              <div className="t-lead mt-4 space-y-4 text-fg/85">
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          {page.references.length > 0 && (
            <ul aria-label="References" className="mt-[clamp(40px,5vw,72px)] space-y-[clamp(32px,4vw,56px)]">
              {page.references.map((r) => (
                <li key={r.src}>
                  <Image src={r.src} alt={r.alt} width={1600} height={1200} quality={90} sizes="(min-width: 800px) 760px, 100vw" className="h-auto w-full" />
                  {r.caption && <p className="t-label mt-2 text-fg/60">{r.caption}</p>}
                </li>
              ))}
            </ul>
          )}

          <section aria-labelledby="make-it-title" className="mt-[clamp(48px,6vw,88px)]">
            <SectionHead id="make-it-title">Reach out to make it happen</SectionHead>
            {page.close && <p className="mt-4 text-[clamp(22px,2.1vw,32px)] leading-[1.25] tracking-[-0.015em] text-balance">{page.close}</p>}
            <p className="t-lead mt-4 flex flex-wrap gap-x-6 gap-y-1">
              <Out href={INSTAGRAM_DM}>DM @kent.fyi</Out>
              <Out href={`mailto:${EMAIL}`}>{EMAIL}</Out>
            </p>
          </section>
        </article>

        {next.slug !== idea.slug && (
          <p className="mt-[clamp(56px,7vw,104px)] border-t border-fg/20 pt-4">
            <span className="t-label block text-fg/60">Next idea</span>
            <Link href={`/next/${next.slug}`} className="mt-2 inline-block text-[clamp(28px,3.2vw,52px)] leading-none tracking-[-0.03em] hover:text-accent">
              {next.title}
              <span aria-hidden>&nbsp;&rarr;</span>
            </Link>
          </p>
        )}
      </main>
  );
}
