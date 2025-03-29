import { ClientTokenRefresher } from "@/components/ClientTokenRefresher";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://storysync.vercel.app"),
  title: {
    default: "StorySync - Collaborative Storytelling Platform",
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
    url: "https://storysync.vercel.app",
    title: "StorySync - Collaborative Storytelling Platform",
    description:
      "StorySync is a collaborative platform where writers can create, share, and co-author stories together.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StorySync - Collaborative Storytelling Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StorySync - Collaborative Storytelling Platform",
    description:
      "StorySync is a collaborative platform where writers can create, share, and co-author stories together.",
    images: ["/og-image.png"],
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
  verification: {
    google: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${inter.className}`}
      suppressHydrationWarning
    >
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
            /*toastOptions={{
            classNames: {
              toast: 'bg-primary text-primary-foreground border-border',
              title: 'text-primary-foreground',
              description: 'text-muted-foreground',
              success: 'bg-green-500 text-green-foreground',
              error: 'bg-destructive text-destructive-foreground',
              warning: 'bg-yellow-500 text-yellow-foreground',
              info: 'bg-blue-500 text-blue-foreground',
              closeButton: 'text-muted-foreground hover:text-primary-foreground'
            }
          }}*/
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
