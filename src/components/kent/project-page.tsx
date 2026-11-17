import Image from "next/image";
import Link from "next/link";
import type { ProjectPageData } from "@/lib/kent";
import { Out, SectionHead } from "./links";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/**
 * A project's own page, kept simple: the title and what it is, the particulars in sections, and a few
 * photographs. On a wide screen the first photograph stays beside the text as you read; on a phone it sits
 * under the title.
 */
export function ProjectPage({ page }: { page: ProjectPageData }) {
  const [lead, ...rest] = page.photos;
  // what Kent hasn't given yet stays off the page: empty rows go, and a section with nothing left goes too
  const sections = page.sections
    .map((s) => ({ ...s, details: s.details?.filter((d) => d.value !== null) }))
    .filter((s) => (s.details?.length ?? 0) > 0 || s.body);

  return (
    <>
      <SiteHeader />
      <main id="main" className="px-(--m) pt-[clamp(28px,5svh,64px)] pb-[clamp(72px,9vw,140px)]">
        <p className="t-small">
          <Link href={`/#${page.id}`} className="text-fg/70 hover:text-hover">
            <span aria-hidden>&larr;&nbsp;</span>All projects
          </Link>
        </p>

        <div className="mt-[clamp(28px,4vw,56px)] grid grid-cols-1 gap-x-(--g) gap-y-10 lg:grid-cols-12">
          <header className="lg:col-span-7 lg:row-start-1">
            <p className="t-label text-fg/65">{page.kind}</p>
            <h1 className="t-display mt-2 animate-[rise_900ms_var(--ease-out-expo)_both]">{page.name}</h1>
            <div className="t-lead mt-6 max-w-[56ch] space-y-4 text-fg/85">
              {page.description.map((d) => (
                <p key={d}>{d}</p>
              ))}
            </div>
            {page.links.length > 0 && (
              <p className="t-small mt-4 flex flex-wrap gap-x-5 gap-y-1">
                {page.links.map((l) => (
                  <Out key={l.href} href={l.href}>
                    {l.label}
                  </Out>
                ))}
              </p>
            )}
          </header>

          {lead && (
            <div className="lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1">
              <div className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-6">
                <Image src={lead.src} alt={lead.alt} fill priority sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" style={{ objectPosition: lead.position }} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-[clamp(40px,5vw,72px)] lg:col-span-7 lg:row-start-2 lg:pt-[clamp(16px,3vw,48px)]">
            {sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-6">
                <SectionHead id={`${s.id}-title`} aside={s.aside}>
                  {s.title}
                </SectionHead>
                {s.details && s.details.length > 0 && (
                  <dl className="mt-1">
                    {s.details.map((d) => (
                      <div key={d.label} className="grid grid-cols-[minmax(7.5em,1fr)_2fr] gap-x-4 border-b border-fg/15 py-3 last:border-b-0">
                        <dt className="t-label pt-[3px] text-fg/60">{d.label}</dt>
                        <dd className="t-lead">{d.href ? <Out href={d.href}>{d.value}</Out> : d.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {s.body && <p className="t-lead mt-4 max-w-[60ch] text-fg/85">{s.body}</p>}
              </section>
            ))}

            {rest.length === 1 && (
              <Image src={rest[0].src} alt={rest[0].alt} width={2000} height={1322} sizes="(min-width: 1024px) 58vw, 100vw" className="h-auto w-full" />
            )}
          </div>
        </div>

        {rest.length > 1 && (
          // small, like the image archive on the home page: columns, each photograph at its own shape
          <section aria-labelledby="photos-title" className="mt-[clamp(56px,7vw,104px)]">
            <SectionHead id="photos-title" aside={`${rest.length} images`}>
              Photographs
            </SectionHead>
            <ul aria-label={`${page.name}, in photographs`} className="mt-[clamp(24px,3vw,44px)] columns-2 gap-(--g) md:columns-3 xl:columns-4">
              {rest.map((p) => (
                <li key={p.src} className="mb-(--g) break-inside-avoid">
                  <Image src={p.src} alt={p.alt} width={1200} height={1500} sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" className="h-auto w-full" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
