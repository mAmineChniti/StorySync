import { ClientTokenRefresher } from "@/components/ClientTokenRefresher";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StorySync",
  description: "Collaborative storytelling with others.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
        </ThemeProvider>
      </body>
    </html>
  );
}
