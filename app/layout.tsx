import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

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
      <body className="bg-background text-foreground">
        {/* <Analytics /> */}
        {/* <SpeedInsights /> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="w-full min-h-screen flex flex-col items-center">
            {children}
          </main>
          {/* <Toaster /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
