import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DINNER, FYIS, LOCALEYES, MODELING, PODCASTS, SWIFT, TBILISI, VOILA, WINE, type Link, type Photo } from "@/lib/kent";
import { FullMoonCountdown } from "./moon";

/** an outside link, the way links read on this site: blue, underlined, an arrow after */
export function Out({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cn("text-link underline decoration-1 underline-offset-[3px] hover:decoration-2", className)}>
      {children}
      <span aria-hidden>&nbsp;&#8599;</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** a photo in a figure, numbered after its footnote: Fig. 1.3 */
function Plate({ photo, n, aspect = "aspect-[4/5]", sizes, className }: { photo: Photo; n: string; aspect?: string; sizes: string; className?: string }) {
  return (
    <figure className={className}>
      <div className={cn("relative overflow-hidden bg-ink/[0.06]", aspect)}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: photo.position ?? "50% 50%" }} />
      </div>
      <figcaption className="mono mt-2 text-ink/55">Fig. {n}</figcaption>
    </figure>
  );
}

/**
 * One footnote: a hairline, its number and name on the left with a line or two of particulars, the claim
 * it backs up set large on the right, then whatever proves it.
 */
function Footnote({ n, id, name, meta, children }: { n: number; id: string; name: string; meta: ReactNode; children: ReactNode }) {
  const claim = FYIS.find((f) => f.n === n)!.text;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-4 border-t border-ink/15 pt-4 pb-[clamp(64px,8vw,120px)]">
      <div className="grid grid-cols-1 gap-x-(--g) gap-y-5 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <p className="text-[15px] leading-tight">
            <sup className="mono mr-1.5 align-[0.4em] text-[11px] text-link">{n}</sup>
            {name}
          </p>
          <div className="mono mt-2 text-ink/55">{meta}</div>
        </div>
        <h3 id={`${id}-title`} className="text-[clamp(26px,3vw,46px)] leading-[1.06] tracking-[-0.022em] text-balance lg:col-span-9">
          {claim}
        </h3>
      </div>
      <div className="mt-[clamp(28px,3.4vw,52px)]">{children}</div>
    </section>
  );
}

const Body = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("max-w-[56ch] text-[17px] leading-[1.5] text-pretty", className)}>{children}</p>
);

const LinkList = ({ links, className }: { links: Link[]; className?: string }) => (
  <ul className={cn("space-y-1 text-[15px] leading-snug", className)}>
    {links.map((l) => (
      <li key={l.label}>{l.href ? <Out href={l.href}>{l.label}</Out> : l.label}</li>
    ))}
  </ul>
);

function Voila() {
  return (
    <Footnote n={1} id="voila" name="VOILA" meta="Specialty instant coffee. With Zane.">
      <div className="grid grid-cols-1 gap-x-(--g) gap-y-10 lg:grid-cols-12">
        {/* the score, set as large as the claim deserves */}
        <div className="lg:col-span-3">
          <p className="text-[clamp(120px,15vw,232px)] leading-[0.78] tracking-[-0.06em]">{VOILA.score.points}</p>
          <p className="mono mt-4 max-w-[26ch] text-ink/55">
            Points from <Out href={VOILA.score.href}>{VOILA.score.source}</Out>. No instant coffee has scored higher.
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-4">
          <Body>{VOILA.body}</Body>
        </div>
        <div className="lg:col-span-3 lg:col-start-10">
          <p className="mono text-ink/55">Written up in</p>
          <LinkList links={VOILA.press} className="mt-2" />
        </div>
      </div>
      <div className="mt-[clamp(32px,4vw,64px)] grid grid-cols-2 gap-x-(--g) gap-y-6 md:grid-cols-4">
        {VOILA.photos.map((p, i) => (
          <Plate key={p.src} photo={p} n={`1.${i + 1}`} sizes="(min-width: 768px) 24vw, 46vw" />
        ))}
      </div>
    </Footnote>
  );
}

function Swift() {
  return (
    <Footnote n={2} id="swift" name="Swift Demolition" meta="Commercial and residential demolition. Bend, Oregon.">
      <div className="grid grid-cols-1 gap-x-(--g) gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Body className="text-[15px]">{SWIFT.body}</Body>
          <p className="mt-4 text-[15px]">
            <Out href={SWIFT.href}>swift-demo.com</Out>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-(--g) gap-y-6 md:grid-cols-4 lg:col-span-9">
          {SWIFT.photos.map((p, i) => (
            <Plate key={p.src} photo={p} n={`2.${i + 1}`} aspect="aspect-[2/3]" sizes="(min-width: 1024px) 17vw, (min-width: 768px) 24vw, 46vw" />
          ))}
        </div>
      </div>
    </Footnote>
  );
}

function LocalEyes() {
  return (
    <Footnote n={3} id="localeyes" name="LocalEyes Growth" meta="SEO for coffee carts, dessert carts and mobile bars.">
      <div className="grid grid-cols-1 gap-x-(--g) gap-y-10 lg:grid-cols-12">
        <blockquote className="text-[clamp(30px,4.4vw,72px)] leading-[1.02] tracking-[-0.03em] text-balance lg:col-span-9 lg:col-start-4">
          &ldquo;{LOCALEYES.quote}&rdquo;
        </blockquote>
        <div className="lg:col-span-5 lg:col-start-4">
          <Body>{LOCALEYES.body}</Body>
          <p className="mt-4 text-[15px]">
            <Out href={LOCALEYES.href}>localeyesgrowth.com</Out>
          </p>
        </div>
        <div className="lg:col-span-3 lg:col-start-10">
          <p className="mono text-ink/55">Listen</p>
          <LinkList links={LOCALEYES.listen} className="mt-2" />
        </div>
      </div>
    </Footnote>
  );
}

function Dinner() {
  return (
    <Footnote n={4} id="dinner" name="dinner.fyi" meta={<>The Lunar Society. {DINNER.terms}</>}>
      <div className="grid grid-cols-1 gap-x-(--g) gap-y-8 lg:grid-cols-12">
        <figure className="lg:col-span-6 lg:col-start-4">
          <div className="relative aspect-[1280/952] overflow-hidden bg-ink/[0.06]">
            <Image src={DINNER.painting.src} alt={DINNER.painting.alt} fill sizes="(min-width: 1024px) 48vw, 92vw" className="object-cover" />
          </div>
          <figcaption className="mono mt-2 text-ink/55">Fig. 4.1 &nbsp;{DINNER.caption}</figcaption>
        </figure>
        <div className="lg:col-span-3 lg:col-start-10 lg:self-end">
          <Body className="text-[15px]">{DINNER.body}</Body>
          <div className="mt-4">
            <FullMoonCountdown />
          </div>
          <p className="mt-4 text-[15px]">
            <Out href={DINNER.href}>dinner.fyi</Out>
          </p>
        </div>
      </div>
    </Footnote>
  );
}

function Wine() {
  return (
    <Footnote n={5} id="wine" name="wine.fyi" meta="Fresh, acidic, white.">
      <div className="grid grid-cols-1 gap-x-(--g) gap-y-8 lg:grid-cols-12">
        <Plate photo={WINE.photo} n="5.1" aspect="aspect-[2/3]" sizes="(min-width: 1024px) 32vw, 92vw" className="lg:col-span-4 lg:col-start-4" />
        <div className="lg:col-span-3 lg:col-start-10 lg:self-end">
          <Body className="text-[15px]">{WINE.body}</Body>
          <p className="mt-4 text-[15px]">
            <Out href={WINE.href}>wine.fyi</Out>
          </p>
        </div>
      </div>
    </Footnote>
  );
}

/** modeling and acting, set as a comp card: the pictures, the particulars, the numbers, the work */
function Modeling() {
  const [lead, ...rest] = MODELING.photos;
  return (
    <Footnote n={6} id="modeling" name="Modeling and acting" meta="Comp card.">
      <div className="grid grid-cols-1 gap-x-(--g) gap-y-8 lg:grid-cols-12">
        <Plate photo={lead} n="6.1" sizes="(min-width: 1024px) 40vw, 92vw" className="lg:col-span-5" />
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-x-(--g) gap-y-6 md:grid-cols-5">
            {rest.map((p, i) => (
              <Plate key={p.src} photo={p} n={`6.${i + 2}`} sizes="(min-width: 1024px) 11vw, (min-width: 768px) 18vw, 46vw" />
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-(--g) gap-y-8 sm:grid-cols-2">
            <dl className="text-[15px] leading-snug">
              <dt className="mono text-ink/55">Name</dt>
              <dd className="mb-3">Kent Sheridan</dd>
              {MODELING.card.map((c) => (
                <div key={c.label}>
                  <dt className="mono text-ink/55">{c.label}</dt>
                  <dd className="mb-3">
                    {c.href ? (
                      <a href={c.href} className="text-link underline decoration-1 underline-offset-[3px]" {...(c.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                        {c.value}
                      </a>
                    ) : (
                      c.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <div>
              <dl className="grid grid-cols-3 gap-x-3">
                {MODELING.numbers.map((m) => (
                  <div key={m.label}>
                    <dd className="text-[clamp(26px,2.6vw,40px)] leading-none tracking-[-0.03em]">{m.figure}</dd>
                    <dt className="mono mt-1.5 text-ink/55">{m.label}</dt>
                  </div>
                ))}
              </dl>
              <p className="mono mt-3 text-ink/55">{MODELING.numbersNote}</p>
            </div>
          </div>

          <table className="mt-10 w-full border-collapse text-left text-[15px] leading-snug">
            <caption className="mono mb-2 text-left text-ink/55">Work</caption>
            <tbody>
              {MODELING.projects.map((p) => (
                <tr key={p.name} className="border-t border-ink/15 align-baseline">
                  <th scope="row" className="py-2.5 pr-4 font-normal">
                    {p.name}
                  </th>
                  <td className="mono hidden py-2.5 pr-4 text-ink/55 sm:table-cell">{p.role}</td>
                  <td className="py-2.5 text-right whitespace-nowrap">
                    {p.links.length ? (
                      <span className="inline-flex gap-3">
                        {p.links.map((l) => (
                          <Out key={l.href} href={l.href}>
                            {l.label}
                          </Out>
                        ))}
                      </span>
                    ) : (
                      <span className="mono text-ink/55">Soon</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Footnote>
  );
}

function Tbilisi() {
  return (
    <Footnote n={7} id="tbilisi" name="Tbilisi" meta="Stories from Georgia through foreign eyes.">
      <div className="grid grid-cols-1 gap-x-(--g) gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Body className="text-[15px]">{TBILISI.body}</Body>
          <LinkList links={TBILISI.links} className="mt-4" />
        </div>
        <div className="grid grid-cols-2 gap-x-(--g) gap-y-6 md:grid-cols-3 lg:col-span-9">
          {TBILISI.photos.map((p, i) => (
            <Plate key={p.src} photo={p} n={`7.${i + 1}`} sizes="(min-width: 1024px) 23vw, (min-width: 768px) 31vw, 46vw" />
          ))}
        </div>
      </div>
    </Footnote>
  );
}

function Podcasts() {
  return (
    <Footnote n={8} id="podcasts" name="Podcasts" meta={<>{PODCASTS.length} so far, on YouTube.</>}>
      <ol className="lg:ml-[calc((100%-11*var(--g))/12*3+3*var(--g))]">
        {PODCASTS.map((p, i) => (
          <li key={p.id} className="border-t border-ink/15">
            <a href={`https://www.youtube.com/watch?v=${p.id}`} target="_blank" rel="noreferrer" className="group grid grid-cols-[96px_1fr] items-center gap-x-4 py-3 sm:grid-cols-[128px_minmax(0,1fr)_minmax(0,1.6fr)]">
              <span className="relative aspect-video overflow-hidden">
                <Image src={`/kent/listen/${p.id}.webp`} alt="" fill sizes="128px" className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0 group-focus-visible:grayscale-0" />
              </span>
              <span className="mono text-ink/55">
                {String(i + 1).padStart(2, "0")} &nbsp;{p.show}
              </span>
              <span className="col-start-2 text-[15px] leading-snug text-pretty group-hover:text-link sm:col-start-3">
                {p.title}
                <span aria-hidden className="text-link">
                  &nbsp;&#8599;
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </Footnote>
  );
}

/** Below the hero: the notes behind each FYI, in order, under one spread heading */
export function Footnotes() {
  return (
    <div id="footnotes" className="px-(--m)">
      <h2 className="flex items-baseline justify-between gap-6 pb-[clamp(20px,2.4vw,36px)] text-[clamp(44px,6.4vw,104px)] leading-[0.9] tracking-[-0.04em]">
        <span>Footnotes</span>
        <span className="hidden text-ink/30 md:inline">one to eight</span>
      </h2>
      <Voila />
      <Swift />
      <LocalEyes />
      <Dinner />
      <Wine />
      <Modeling />
      <Tbilisi />
      <Podcasts />
    </div>
  );
}
