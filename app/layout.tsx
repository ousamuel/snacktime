import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { Toaster } from "@/components/ui/toaster";

const defaultUrl =
  process.env.NODE_ENV == "development"
    ? `http://localhost:3000`
    : "https://www.snacktimeworldwide.com";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Snacktime Worldwide",
  description: "Snacktime",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik+Bubbles&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground">
        {/* <Analytics /> */}
        {/* <SpeedInsights /> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex flex-col w-full flex-1">{children}</div>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
