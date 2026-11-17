import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const style = "underline decoration-1 underline-offset-[4px] transition-colors hover:text-accent hover:decoration-accent";

/** a link to another site, opening in a new tab; a page on this site (/...) or an in-page link (#...) stays here */
export function Out({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  if (!href) return <span className={className}>{children}</span>;
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cn(style, className)}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cn(style, className)}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cn(style, className)}>
      {children}
      <span aria-hidden>&nbsp;&#8599;</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** the head of a section: a hairline, then its name in the label type */
export function SectionHead({ id, children, aside }: { id: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-fg/20 pt-4">
      <h2 id={id} className="t-label text-fg/70">
        {children}
      </h2>
      {aside && <div className="t-label text-fg/50">{aside}</div>}
    </div>
  );
}
