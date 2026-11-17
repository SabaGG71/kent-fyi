import Link from "next/link";

const LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Georgia", href: "/#georgia" },
  { label: "Modeling", href: "/#modeling" },
  { label: "Press", href: "/#press" },
  { label: "Archive", href: "/#archive" },
  { label: "Contact", href: "/#contact" },
];

/** the address as the logo, and a short row of links. It scrolls away with the page. */
export function SiteHeader() {
  return (
    <header className="flex items-baseline justify-between gap-6 px-(--m) pt-4 text-[15px] leading-none">
      <Link href="/" translate="no" className="hover:text-accent">
        kent.fyi
      </Link>
      <nav aria-label="Primary">
        <ul className="flex flex-wrap justify-end gap-x-5 gap-y-2">
          {LINKS.map((l) => (
            <li key={l.href} className={l.label === "Georgia" || l.label === "Archive" ? "hidden sm:block" : undefined}>
              <Link href={l.href} className="text-fg/80 transition-colors hover:text-accent">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
