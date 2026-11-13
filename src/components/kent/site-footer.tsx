"use client";

import Image from "next/image";
import { DINNER, EMAIL, INSTAGRAM, LOCALEYES, MANAGER, SWIFT, WINE, YOUTUBE } from "@/lib/kent";
import { Out } from "./footnotes";
import { proofOf, useProof } from "./proofs";
import { useTbilisiTime, useYear } from "./time";

const ELSEWHERE = [
  { label: "Instagram", href: INSTAGRAM },
  { label: "YouTube", href: YOUTUBE },
  { label: "LocalEyes Growth", href: LOCALEYES.href },
  { label: "Swift Demolition", href: SWIFT.href },
  { label: "dinner.fyi", href: DINNER.href },
  { label: "wine.fyi", href: WINE.href },
];

/**
 * The last page: how to reach Kent, laid out like a colophon, then his marble in the proof you picked,
 * edge to edge, as the end paper.
 */
export function SiteFooter() {
  const proof = proofOf(useProof());
  const time = useTbilisiTime();
  const year = useYear();

  return (
    <footer id="contact" className="mt-[clamp(32px,4vw,64px)]">
      <div className="grid grid-cols-2 gap-x-(--g) gap-y-8 border-t border-ink/15 px-(--m) pt-4 pb-[clamp(48px,6vw,88px)] lg:grid-cols-12">
        <div className="col-span-2 lg:col-span-6">
          <p className="mono text-ink/55">Contact</p>
          <a href={`mailto:${EMAIL}`} className="mt-2 inline-block text-[clamp(32px,4.4vw,72px)] leading-none tracking-[-0.03em] text-link underline decoration-2 underline-offset-[0.12em]">
            {EMAIL}
          </a>
        </div>
        <div className="lg:col-span-3 lg:col-start-7">
          <p className="mono text-ink/55">Management</p>
          <a href={`mailto:${MANAGER}`} className="mt-2 inline-block text-[15px] text-link underline decoration-1 underline-offset-[3px]">
            {MANAGER}
          </a>
        </div>
        <div className="lg:col-span-3 lg:col-start-10">
          <p className="mono text-ink/55">Elsewhere</p>
          <ul className="mt-2 space-y-1 text-[15px] leading-snug">
            {ELSEWHERE.map((l) => (
              <li key={l.label}>
                <Out href={l.href}>{l.label}</Out>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* the end paper: his marble, in the proof you picked */}
      <div className="relative h-[clamp(200px,30vw,440px)] overflow-hidden bg-print-flood">
        <Image key={proof.key} src={proof.band} alt="" fill sizes="100vw" className="animate-[fade-in_600ms_ease_both] object-cover" />
      </div>

      <div className="mono flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-(--m) py-3 text-ink/55">
        <span>&copy; Kent Sheridan {year}</span>
        <span>
          End paper: Kent&rsquo;s marble, proof {proof.name}.{time && <> Tbilisi, {time}.</>}
        </span>
      </div>
    </footer>
  );
}
