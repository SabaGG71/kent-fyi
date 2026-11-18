import Link from "next/link";

const LINKS = [
  { label: "Projects", href: "/#projects" },
  { label: "Modeling", href: "/#modeling" },
  { label: "YouTube", href: "/#youtube" },
  { label: "Archive", href: "/#archive" },
  { label: "Contact", href: "/#contact" },
];

/** the address as the logo, and a short row of links. It scrolls away with the page. */
export function SiteHeader() {
  return (
    <header className="relative z-10 flex h-(--header) items-end justify-between gap-6 px-(--m) text-[15px] leading-none">
      <Link href="/" translate="no" className="hover:text-hover">
        kent.fyi
      </Link>
      <nav aria-label="Primary">
        <ul className="flex flex-wrap justify-end gap-x-5 gap-y-2">
          {LINKS.map((l) => (
            <li key={l.href} className={l.label === "YouTube" || l.label === "Archive" ? "hidden sm:block" : undefined}>
              <Link href={l.href} className="text-fg/80 hover:text-hover">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
