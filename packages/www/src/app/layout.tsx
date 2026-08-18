import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

import type { Metadata } from "next";
import { DM_Sans, Space_Mono, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Overbook",
  description: "The booking management platform for music agencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", spaceMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}