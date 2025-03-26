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
import { Toaster } from "sonner";

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
          <Toaster
            position="bottom-right"
            // richColors
            closeButton
            expand={true}
            duration={3000}
            theme="system"
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
