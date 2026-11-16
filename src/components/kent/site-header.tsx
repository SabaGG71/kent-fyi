import Link from "next/link";
import { EMAIL } from "@/lib/kent";

const LINKS = [
  { label: "Footnotes", href: "/#footnotes" },
  { label: "Modeling", href: "/#modeling" },
  { label: "Podcasts", href: "/#podcasts" },
  { label: "P.S.", href: "/#play" },
  { label: "Game", href: "/#game" },
  { label: "About", href: "/about" },
];

/** The address as the logo, the way a link reads, and a short row of links. It scrolls away with the page. */
export function SiteHeader({ current }: { current?: "about" }) {
  return (
    <header className="flex items-baseline justify-between gap-6 px-(--m) pt-3.5 text-[15px] leading-none">
      <Link href="/" translate="no" className="underline decoration-1 underline-offset-[3px] hover:text-link">
        kent.fyi
      </Link>
      <nav aria-label="Primary">
        <ul className="flex flex-wrap justify-end gap-x-5 gap-y-2">
          {LINKS.map((l) => (
            <li key={l.href} className={l.label === "Footnotes" || l.label === "Modeling" ? "hidden sm:block" : undefined}>
              <Link
                href={l.href}
                aria-current={current === "about" && l.href === "/about" ? "page" : undefined}
                className="hover:text-link aria-[current=page]:underline aria-[current=page]:underline-offset-[3px]"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="hidden md:block">
            <a href={`mailto:${EMAIL}`} className="text-link underline decoration-1 underline-offset-[3px]">
              {EMAIL}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
