import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { ExtensionGuard } from "@/components/providers/extension-guard";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "Unicity",
    "Sphere",
    "Treasury",
    "AI Agent",
    "UCT",
    "Autonomous Finance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full dark`}>
      <body className="min-h-full bg-background text-foreground antialiased">
        <ExtensionGuard />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}