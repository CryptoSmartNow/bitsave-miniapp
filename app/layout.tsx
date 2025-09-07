import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ReferralTracker from "@/components/ReferralTracker";
import { APP_NAME, APP_DESCRIPTION, APP_OG_IMAGE_URL } from "../lib/constants";
import { getMiniAppEmbedMetadata } from "@/lib/utils";

// Configure Space Grotesk font with all weights
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: APP_NAME,
    openGraph: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [APP_OG_IMAGE_URL],
    },
    other: {
      "fc:frame": JSON.stringify(getMiniAppEmbedMetadata()),
    },
  };
}

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
