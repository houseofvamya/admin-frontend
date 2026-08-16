import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

// Self-hosted rather than next/font/google: the Google Fonts fetch happens at
// build time and is unreliable in CI (Netlify's build network returned 404s for
// stale gstatic URLs, failing the build). These are the same latin-subset
// variable files Google serves, vendored into the repo.
const cormorant = localFont({
  variable: "--font-cormorant",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  src: [
    {
      path: "./fonts/CormorantGaramond-Variable-latin.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "./fonts/CormorantGaramond-Variable-Italic-latin.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
});

const manrope = localFont({
  variable: "--font-manrope",
  display: "swap",
  adjustFontFallback: "Arial",
  src: [
    {
      path: "./fonts/Manrope-Variable-latin.woff2",
      weight: "200 800",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "House of Vamya — Admin",
    template: "%s — House of Vamya Admin",
  },
  description: "Admin dashboard for House of Vamya fine jewellery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory font-sans text-charcoal">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
