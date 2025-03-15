import type { Metadata } from "next";
import { Geist, MedievalSharp } from "next/font/google";
import { NextAuthProvider } from "./providers";
import Navbar from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const medievalSharp = MedievalSharp({
  weight: "400",
  variable: "--font-medievalsharp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypt of Greed",
  description: "Crypt of Greed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${medievalSharp.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextAuthProvider>
          <Navbar />
          <main className="mt-16">{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
