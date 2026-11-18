import Image from "next/image";
import { ARCHIVE, CONTACT, CURRENT, EARLIER, EMAIL, FEATURES, GEORGIA, INSTAGRAM, INTRO, INTRO_PHOTO, MANAGER, MODELING, YOUTUBE } from "@/lib/kent";
import { ArchiveGrid } from "./archive-grid";
import { Out, SectionHead } from "./links";
import { PhotoStrip } from "./photo-strip";
import { ProjectIndex } from "./project-index";
import { Video } from "./videos";
import { WouldLike } from "./would-like";

const section = "scroll-mt-4 px-(--m) pb-[clamp(72px,9vw,140px)]";

/** Kent, briefly, then what he's working on now: the index, a photograph on the right for each */
export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-4 px-(--m) pb-[clamp(72px,9vw,140px)] lg:pt-[clamp(40px,8svh,96px)]">
      {/* on a phone the photograph is the first screen, edge to edge, under the header, the introduction over its dark foot */}
      <div className="relative -mx-(--m) -mt-(--header) h-svh min-h-[520px] overflow-hidden lg:hidden">
        <Image src={INTRO_PHOTO.src} alt={INTRO_PHOTO.alt} fill loading="eager" fetchPriority="high" sizes="(max-width: 1023px) 175vw, 1px" className="object-cover object-[46%_50%]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[58%] bg-linear-to-t from-black via-black/75 to-transparent" />
        <p className="absolute right-(--m) bottom-[max(28px,env(safe-area-inset-bottom))] left-(--m) animate-[rise_900ms_var(--ease-out-expo)_both] text-[clamp(24px,6.9vw,40px)] leading-[1.05] tracking-[-0.03em] text-balance">{INTRO}</p>
      </div>
      <ProjectIndex projects={CURRENT} fallback={INTRO_PHOTO}>
        <p className="t-display hidden max-w-[22ch] animate-[rise_900ms_var(--ease-out-expo)_both] text-balance lg:block">{INTRO}</p>
        <div id="next" className="scroll-mt-6">
          <WouldLike />
        </div>
        <div id="projects" className="mt-[clamp(48px,7vw,104px)] scroll-mt-6">
          <SectionHead id="work-title">Current selection</SectionHead>
        </div>
      </ProjectIndex>
    </section>
  );
}

/** VOILA and Swift: what came before */
export function Earlier() {
  return (
    <section id="earlier" aria-labelledby="earlier-title" className={section}>
      <ProjectIndex projects={EARLIER} fallback={EARLIER[0].photo} compact>
        <SectionHead id="earlier-title">Earlier projects</SectionHead>
      </ProjectIndex>
    </section>
  );
}

/** KENT.FYI's subject: Georgia, in photographs from his Instagram */
export function Georgia() {
  return (
    <section id="georgia" aria-labelledby="georgia-title" className={section}>
      <SectionHead id="georgia-label" aside="KENT.FYI">
        Content
      </SectionHead>
      <div className="mt-[clamp(22px,2.6vw,36px)] grid grid-cols-1 gap-x-(--g) gap-y-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h3 id="georgia-title" className="t-display">
            GEORGIA
          </h3>
          <p className="t-lead mt-3 text-fg">{GEORGIA.line}</p>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:pt-2">
          <p className="t-lead text-fg/85">{GEORGIA.body}</p>
          <p className="t-small mt-3 flex flex-wrap gap-x-5 gap-y-1">
            {GEORGIA.links.map((l) => (
              <Out key={l.label} href={l.href}>
                {l.label}
              </Out>
            ))}
          </p>
        </div>
      </div>
      <PhotoStrip scroll photos={GEORGIA.photos} label="Georgia, in photographs" className="mt-[clamp(28px,3.4vw,52px)]" />
    </section>
  );
}

/** KENT.FYI on YouTube: three videos and the channel */
export function YouTube() {
  return (
    <section id="youtube" aria-labelledby="youtube-title" className={section}>
      <SectionHead id="youtube-title" aside={<Out href={YOUTUBE.channel}>{YOUTUBE.handle}</Out>}>
        On YouTube
      </SectionHead>
      <ul className="mt-[clamp(22px,2.6vw,36px)] grid grid-cols-1 gap-x-(--g) gap-y-8 md:grid-cols-3">
        {YOUTUBE.videos.map((v) => (
          <li key={v.id}>
            <Video id={v.id} title={v.title} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** modeling: the main photograph, the card, the numbers, the work */
export function Modeling() {
  return (
    <section id="modeling" aria-labelledby="modeling-title" className={section}>
      <SectionHead id="modeling-title">Modeling</SectionHead>
      <div className="mt-[clamp(22px,2.6vw,36px)] grid grid-cols-1 gap-x-(--g) gap-y-10 lg:grid-cols-12">
        <div className="flex flex-col gap-(--g) lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src={MODELING.photo.src} alt={MODELING.photo.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: MODELING.photo.position }} />
          </div>
        </div>
        <div className="flex flex-col gap-10 lg:col-span-6 lg:col-start-7">
          <dl className="grid grid-cols-[8.5em_1fr] gap-y-2">
            {MODELING.card.map((c) => (
              <div key={c.label} className="contents">
                <dt className="t-label pt-[3px] text-fg/60">{c.label}</dt>
                <dd className="t-lead">{c.href ? <Out href={c.href}>{c.value}</Out> : c.value}</dd>
              </div>
            ))}
          </dl>
          <div>
            <ul className="flex flex-wrap gap-x-[clamp(24px,3vw,48px)] gap-y-4">
              {MODELING.numbers.map((n) => (
                <li key={n.label}>
                  <p className="text-[clamp(34px,3.4vw,52px)] leading-none tracking-[-0.03em]">{n.figure}</p>
                  <p className="t-small mt-1 text-fg/65">{n.label}</p>
                </li>
              ))}
            </ul>
            <p className="t-small mt-3 text-fg/55">{MODELING.numbersNote}</p>
          </div>
          <div>
            <p className="t-label text-fg/60">Work</p>
            <ul className="mt-3">
              {MODELING.work.map((w) => (
                <li key={w.name} className="grid grid-cols-1 gap-x-4 gap-y-1 border-t border-fg/20 py-3 sm:grid-cols-[1.2fr_1fr_auto]">
                  <span className="t-lead">{w.name}</span>
                  <span className="t-small self-center text-fg/65">{w.role}</span>
                  <span className="t-small flex gap-4 self-center">
                    {w.links.length ? (
                      w.links.map((l) => (
                        <Out key={l.href} href={l.href}>
                          {l.label}
                        </Out>
                      ))
                    ) : (
                      <span className="text-fg/55">{"note" in w ? w.note : ""}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid grid-cols-2 gap-(--g) sm:grid-cols-3">
            {MODELING.photos.map((p, i) => (
              <li key={p.src} className={i === 0 ? "relative col-span-2 aspect-[4/5] overflow-hidden sm:col-span-1" : "relative aspect-[4/5] overflow-hidden"}>
                <Image src={p.src} alt={p.alt} fill sizes={i === 0 ? "(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 100vw" : "(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"} className="object-cover" style={{ objectPosition: p.position }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** a few conversations, small and quiet: year, show, title */
export function Press() {
  return (
    <section id="press" aria-labelledby="press-title" className={section}>
      <SectionHead id="press-title">Features</SectionHead>
      <ul className="t-small mt-3 lg:w-2/3">
        {FEATURES.map((f) => (
          <li key={f.id} className="grid grid-cols-[3.5em_1fr] gap-x-3 border-b border-fg/10 py-2 last:border-b-0 sm:grid-cols-[3.5em_14em_1fr]">
            <span className="text-fg/50 tabular-nums">{f.year}</span>
            <span className="text-fg/60">{f.show}</span>
            <span className="col-start-2 sm:col-start-auto">
              <Out href={`https://www.youtube.com/watch?v=${f.id}`}>{f.title}</Out>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** the image archive: what he notices, an issue at a time, no captions */
export function Archive() {
  return (
    <section id="archive" aria-labelledby="archive-title" className={section}>
      <SectionHead id="archive-title" aside={`${ARCHIVE.photos.length} images`}>
        Image archive, issue {ARCHIVE.issue}
      </SectionHead>
      <ArchiveGrid photos={ARCHIVE.photos} />
    </section>
  );
}

/** how to reach him: management first, his own address smaller */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className={section}>
      <SectionHead id="contact-title">Contact</SectionHead>
      <div className="mt-[clamp(22px,2.6vw,36px)] grid grid-cols-1 gap-x-(--g) gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="t-lead text-fg/85">{CONTACT.line}</p>
          <p className="t-label mt-6 text-fg/60">Management</p>
          <a href={`mailto:${MANAGER}`} className="mt-2 inline-block text-[clamp(30px,3.6vw,56px)] leading-none tracking-[-0.03em] underline decoration-2 underline-offset-[0.14em] hover:text-hover">
            {MANAGER}
          </a>
        </div>
        <div className="t-small space-y-1 lg:col-span-3 lg:col-start-10 lg:pt-1">
          <p className="t-label text-fg/60">Kent</p>
          <p>
            <Out href={`mailto:${EMAIL}`}>{EMAIL}</Out>
          </p>
          <p>
            <Out href={INSTAGRAM}>@kent.fyi on Instagram</Out>
          </p>
        </div>
      </div>
    </section>
  );
}
