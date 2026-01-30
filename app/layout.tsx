import Provider from "@/app/common/components/SessionProvider";
import { ThemeProvider } from "@/app/common/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { EdgeStoreProvider } from "./common/utils/edgestore";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOS Resoles | Climbing Shoe Resole Service",
  description:
    "Summit Outdoor Store is an outdoor equipment shop and rock climbing shoe resole service. Resole and rand repair available.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "flex bg-background font-sans antialiased",
          fontSans.variable
        )}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <EdgeStoreProvider>
            <Provider>{children}</Provider>
          </EdgeStoreProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
