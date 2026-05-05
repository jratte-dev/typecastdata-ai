import type { Metadata } from "next";
import { Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sans = Hanken_Grotesk({
  variable: "--font-sans-stack",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-stack",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Typecast Data AI",
    template: "%s · Typecast Data AI",
  },
  description:
    "John Ratté on data engineering, AI, and the gap between what gets shipped and what gets shipped well.",
  authors: [{ name: "John Ratté" }],
  creator: "John Ratté",
  openGraph: {
    type: "website",
    siteName: "Typecast Data AI",
    title: "Typecast Data AI",
    description:
      "Data engineering, AI, and the gap between what gets shipped and what gets shipped well. By John Ratté, in New Orleans.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typecast Data AI",
    description:
      "Data engineering, AI, and the gap between what gets shipped and what gets shipped well.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem("theme");
                  var mode = stored === "light" || stored === "dark"
                    ? stored
                    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                  document.documentElement.setAttribute("data-theme", mode);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <a
          href="#main"
          className="
            sr-only focus:not-sr-only
            focus:fixed focus:top-3 focus:left-3 focus:z-[100]
            focus:bg-[color:var(--ink)] focus:text-[color:var(--paper)]
            focus:px-4 focus:py-2 focus:font-mono focus:text-[12px]
            focus:uppercase focus:tracking-[0.08em]
          "
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
