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

const description = "Kent Sheridan, based in Tbilisi: WINE.FYI, DINNER.FYI, KENT.FYI and LocalEyes, before that VOILA and Swift Demolition.";

// the address shares are made from: the production domain on Vercel, kent-fyi.vercel.app otherwise
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://kent-fyi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "kent.fyi",
  description,
  // the share image itself is app/opengraph-image.jpg
  openGraph: { title: "kent.fyi", description, url: "/", siteName: "kent.fyi", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "kent.fyi", description },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
