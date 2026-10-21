import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, IBM_Plex_Mono, Permanent_Marker } from "next/font/google";
import { BG_STYLE, BOOT_SCRIPT } from "@/lib/site";
import ModeSync from "@/components/ModeSync";
import "./globals.css";

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-barlow", display: "swap" });
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-marker", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Rohan Katreddy", template: "%s · Rohan Katreddy" },
  description: "Rohan Katreddy: always building in aerial robotics and AI.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e6e8eb" },
    { media: "(prefers-color-scheme: dark)", color: "#121418" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [barlow, barlowCondensed, plexMono, marker].map((f) => f.variable).join(" ");
  return (
    // data-mode / data-intro are added by BOOT_SCRIPT before hydration.
    <html lang="en" data-bg={BG_STYLE} className={fonts} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <ModeSync />
        {children}
      </body>
    </html>
  );
}
