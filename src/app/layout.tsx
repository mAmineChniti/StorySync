import ClientTokenRefresher from "@/components/ClientTokenRefresher";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Providers } from "@/components/providers";
import { ReactScan } from "@/components/ReactScan";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import { Geist } from "next/font/google";

import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { type Metadata } from "next";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const siteUrl =
  env.NEXT_PUBLIC_SITE_URL || "https://storysync-delta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "StorySync - Create, Share, and Collaborate on Stories",
    template: "StorySync | %s",
  },
  description:
    "StorySync is a collaborative platform where writers can create, share, and co-author stories together. Join a community of storytellers and bring your imagination to life.",
  keywords: [
    "storytelling",
    "collaborative writing",
    "creative writing",
    "story creation",
    "online writing community",
  ],
  authors: [{ name: "StorySync Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "StorySync - Create, Share, and Collaborate on Stories",
    description:
      "StorySync is a collaborative platform where writers can create, share, and co-author stories together.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "StorySync - Create, Share, and Collaborate on Stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StorySync - Create, Share, and Collaborate on Stories",
    description:
      "StorySync is a collaborative platform where writers can create, share, and co-author stories together.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  //   verification: {
  //     google: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  //   },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      {env.NEXT_PUBLIC_DEBUG && <ReactScan />}
      <ClientTokenRefresher />
      <Analytics />
      <body className="bg-background text-primary-foreground min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavBar />
          <main className="pt-16 pb-16 w-full bg-background text-primary-foreground">
            <Providers>{children}</Providers>
          </main>
          <Footer />
          <Toaster
            position="bottom-right"
            // richColors
            closeButton
            expand={true}
            duration={3000}
            /*
toastOptions={{
      classNames: {
        toast: "bg-primary text-primary-foreground border-border",
        title: "text-primary-foreground",
        description: "text-muted-foreground",
        success: "bg-green-500 text-green-foreground",
        error: "bg-destructive text-destructive-foreground",
        warning: "bg-yellow-500 text-yellow-foreground",
        info: "bg-blue-500 text-blue-foreground",
        closeButton:
          "text-muted-foreground hover:text-primary-foreground",
      },
    }}
*/
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
