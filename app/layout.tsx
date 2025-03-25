import type { Metadata, Viewport } from "next";
import { Geist, MedievalSharp } from "next/font/google";
import { NextAuthProvider } from "./providers";
import { WalletProvider } from "@/context/wallet-connection";
import { CharacterProvider } from "@/context/character-context";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cryptofgreed.com"),
  title: {
    default: "Crypt of Greed - NFT Roguelike Card Game",
    template: "%s | Crypt of Greed",
  },
  description:
    "Embark on an epic roguelike card adventure where every decision shapes your destiny. Battle monsters, collect NFT treasures, and forge your legacy on Core DAO blockchain.",
  keywords: [
    "NFT game",
    "blockchain game",
    "roguelike",
    "card game",
    "Core DAO",
    "play to earn",
    "crypto gaming",
    "web3 game",
  ],
  authors: [{ name: "Crypt of Greed Team" }],
  creator: "Crypt of Greed",
  publisher: "Crypt of Greed",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cryptofgreed.com",
    title: "Crypt of Greed - NFT Roguelike Card Game",
    description:
      "Battle monsters, collect NFT treasures, and forge your legacy in this epic roguelike card game on Core DAO blockchain.",
    siteName: "Crypt of Greed",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Crypt of Greed - NFT Roguelike Card Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypt of Greed - NFT Roguelike Card Game",
    description:
      "Battle monsters, collect NFT treasures, and forge your legacy in this epic roguelike card game on Core DAO blockchain.",
    creator: "@cryptofgreed",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-verification-code",
  },
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
          <WalletProvider>
            <CharacterProvider>
              <Navbar />
              <main className="mt-16">{children}</main>
            </CharacterProvider>
          </WalletProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
