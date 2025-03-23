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
      <body className="bg-background text-primary-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <ClientTokenRefresher />
          <main className="min-h-[calc(100vh-8rem)] pt-16 pb-16">
            <Providers>{children}</Providers>
          </main>
          <Analytics />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
