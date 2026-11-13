import type { Metadata, Viewport } from "next";
import { Fragment_Mono, Instrument_Sans } from "next/font/google";
import { Preloader } from "@/components/kent/preloader";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import "./globals.css";

// Instrument Sans for everything you read, Fragment Mono (a Helvetica cut as a monospace) for the
// particulars: figure numbers, labels, the time
const sans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const mono = Fragment_Mono({
  variable: "--font-fragment",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "kent.fyi",
  description: "Kent Sheridan, for your information: VOILA, Swift Demolition, LocalEyes Growth, dinner.fyi, wine.fyi, modeling and acting, from Tbilisi.",
};

export const viewport: Viewport = {
  themeColor: "#ebeae7",
  colorScheme: "light",
  viewportFit: "cover",
};

// Runs before first paint: the proof a visitor picked last time is in place before anything draws, the
// marbling preloader is skipped if it has played this session or the visitor prefers less motion, and with
// motion allowed the hero starts from its opening's first frame (globals.css) so nothing shows twice.
const flags = `var h=document.documentElement;try{var p=localStorage.getItem('kentfyi:proof');if(p)h.dataset.proof=p}catch(e){}var r=matchMedia('(prefers-reduced-motion: reduce)').matches;try{if(sessionStorage.getItem('kentfyi:intro')||r)h.dataset.intro='seen'}catch(e){}if(!r)h.classList.add('hero-pending')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: flags }} />
      </head>
      <body>
        <Preloader />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
