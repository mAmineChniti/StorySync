import Footer from "@/components/Footer";
import { ClientTokenRefresher } from "@/components/ClientTokenRefresher";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/providers";
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import NavBar from "@/components/NavBar";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

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
    <html lang="en" className={`${GeistSans.variable} ${inter.className}`} suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900">
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
