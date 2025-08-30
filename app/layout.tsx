import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

// Configure Space Grotesk font with all weights
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

import { Providers } from "./providers";
import ReferralTracker from "@/components/ReferralTracker";
import { APP_URL } from "@/lib/constants";

// Add this import to your layout file
// import "../styles/date-picker.css";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "BitSave - Simplified Crypto Savings",
  description:
    "BitSave offers a simplified approach to crypto investing with professionally managed portfolios.",
  openGraph: {
    title: "BitSave - Simplified Crypto Savings",
    description:
      "BitSave offers a simplified approach to crypto investing with professionally managed portfolios.",
    images: [
      {
        url: "/bitsavepreview.png",
        width: 1200,
        height: 630,
        alt: "BitSave - Simplified Crypto Savings",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BitSave - Simplified Crypto Savings",
    description:
      "BitSave offers a simplified approach to crypto investing with professionally managed portfolios.",
    images: ["/bitsavepreview.png"],
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { url: "/favicon_io/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon_io/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/favicon_io/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <body className={`${spaceGrotesk.className}`}>
        <Providers>
          <ReferralTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
