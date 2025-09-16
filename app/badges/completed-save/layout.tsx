import type { Metadata } from "next";
import { APP_NAME, APP_DESCRIPTION, APP_OG_IMAGE_URL, APP_URL } from "../../../lib/constants";
import { getMiniAppEmbedMetadata } from "@/lib/utils";

export const revalidate = 300;

const BADGE_IMAGE_URL = `${APP_URL}/badges/completed-save.png`;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: APP_NAME,
    openGraph: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [APP_OG_IMAGE_URL],
    },
    other: {
      "fc:frame": JSON.stringify(getMiniAppEmbedMetadata(BADGE_IMAGE_URL)),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
