import type { Metadata, Viewport } from "next";
import { Fragment_Mono, Instrument_Sans } from "next/font/google";
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

const description = "Kent Sheridan, for your information: VOILA, Swift Demolition, LocalEyes Growth, dinner.fyi, wine.fyi, modeling and acting, from Tbilisi.";

// the address shares are made from: the production domain on Vercel, kent-fyi.vercel.app otherwise
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://kent-fyi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "kent.fyi",
  description,
  // the share image itself is app/opengraph-image.jpg: his portrait set in type, beside the list
  openGraph: { title: "kent.fyi", description, url: "/", siteName: "kent.fyi", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "kent.fyi", description },
};

export const viewport: Viewport = {
  themeColor: "#ebeae7",
  colorScheme: "light",
  viewportFit: "cover",
};

// Runs before first paint: the proof a visitor picked last time is in place before anything draws, and with
// motion allowed the hero starts from its opening's first frame (globals.css) so nothing shows twice.
const flags = `var h=document.documentElement;try{var p=localStorage.getItem('kentfyi:proof');if(p)h.dataset.proof=p}catch(e){}if(!matchMedia('(prefers-reduced-motion: reduce)').matches)h.classList.add('hero-pending')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: flags }} />
      </head>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
