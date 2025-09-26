import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { ThemeProvider } from "@/components/site/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/lib/env";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const navigation = [
  { href: "/", label: "Home" },
  { href: "/process", label: "Process" },
  { href: "/galleries", label: "Galleries" },
  { href: "/prints", label: "Prints" },
  { href: "/contact", label: "Contact" },
];

const siteUrl = env.SITE_URL ?? "https://www.susanmohrart.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Susan Mohr Art",
    template: "%s | Susan Mohr Art",
  },
  description: "Original artwork, prints, and commissions by Iowa-based painter Susan Mohr.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Susan Mohr Art",
    title: "Susan Mohr Art",
    description: "Explore original paintings, fine art prints, and custom commissions by Susan Mohr.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Susan Mohr Art",
    description: "Original artwork, prints, and commissions by Susan Mohr.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-background font-sans antialiased`}
      >
        <ThemeProvider>
          <SiteHeader
            navigation={navigation}
            cta={{ label: "Shop Prints", href: "/prints" }}
            logoTagline="Fine art & commissions"
          />
          <main className="flex-1">{children}</main>
          <SiteFooter
            navigation={navigation}
            copyrightName="Susan Mohr Art"
          />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
