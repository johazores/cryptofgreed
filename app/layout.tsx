import type { Metadata, Viewport } from "next";
import { Geist, MedievalSharp } from "next/font/google";
import { NextAuthProvider } from "./providers";
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
};

const title = "Crypt of Greed - Deckbuilding Roguelite Prototype";
const description =
  "A turn-based deckbuilding roguelite prototype about deciding when to bank your treasure and when to risk carrying it deeper into the crypt.";

export const metadata: Metadata = {
  metadataBase: new URL("https://cryptofgreed.com"),
  title: {
    default: title,
    template: "%s | Crypt of Greed",
  },
  description,
  keywords: [
    "deckbuilding roguelite",
    "turn-based card game",
    "indie game",
    "dark fantasy",
    "strategy game",
  ],
  authors: [{ name: "Crypt of Greed Team" }],
  creator: "Crypt of Greed",
  publisher: "Crypt of Greed",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cryptofgreed.com",
    title,
    description,
    siteName: "Crypt of Greed",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Crypt of Greed deckbuilding roguelite prototype",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
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
          <CharacterProvider>
            <Navbar />
            <main className="mt-16">{children}</main>
          </CharacterProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
