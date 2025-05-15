import { ProgressBar } from "@/components/advance/progress-bar";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";
import "./globals.css";
import type { RootLayoutContextValue } from "@/components/app/rootLayout/defines";
import { RootLayoutContextProvider } from "@/components/app/rootLayout/rootLayout";
import { Toaster } from "@/components/ui/sonner";
import { getAppLocale } from "@/integrations/i18n/request";
import { getSession } from "@/lib/session.server";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { cookies, headers } from "next/headers";
import { pick } from "radashi";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nextop",
  description: "Nextop is a boilerplate built on Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { defaultTheme, contextValue, appLocale } = await preprocess();
  return (
    <html lang={appLocale} suppressHydrationWarning>
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased`,
          {
            "is-mobile": contextValue.defaultIsMobile,
          },
        )}
      >
        <ThemeProvider
          attribute="class"
          themes={["light", "dark", "system"]}
          defaultTheme={defaultTheme}
          enableSystem
        >
          <NextIntlClientProvider>
            <NuqsAdapter>
              <RootLayoutContextProvider value={contextValue}>
                <ProgressBar>{children}</ProgressBar>
              </RootLayoutContextProvider>
            </NuqsAdapter>
          </NextIntlClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

async function preprocess() {
  const session = await getSession();
  const cookieStore = await cookies();
  const headersList = await headers();
  const defaultTheme = cookieStore.get("app_theme")?.value || "system";
  const defaultThemeResolved =
    cookieStore.get("app_theme_resolved")?.value || "light";
  const defaultLanguage =
    headersList.get("accept-language")?.split(",")[0] || "en";
  const defaultIsMobile =
    headersList.get("user-agent")?.includes("Mobile") || false;
  const contextValue: RootLayoutContextValue = {
    defaultIsMobile,
    defaultLanguage,
    defaultTheme,
    defaultThemeResolved,
    session: pick(session, ["userRole", "username"]),
  };
  const appLocale = await getAppLocale();
  return { contextValue, defaultTheme, appLocale };
}
