import Image from "next/image";

/** the end paper: Kent's black marble, edge to edge, nothing written on it */
export function SiteFooter() {
  return (
    <footer className="relative h-[clamp(100px,15vw,220px)] overflow-hidden" aria-hidden>
      <Image src="/kent/marble-black.webp" alt="" fill sizes="100vw" className="object-cover" />
    </footer>
  );
}
