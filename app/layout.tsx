import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xandeum pNode Analytics",
  description:
    "Real-time analytics and monitoring for Xandeum storage network pNodes",
  icons: {
    icon: [
      {
        url: "/xandium-logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/xandium-logo.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/xandium-logo.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/xandium-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
