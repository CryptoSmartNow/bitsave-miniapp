import { Metadata } from "next";
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Security from './components/Security';
import Features from './components/Features';
import Team from './components/Team';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { APP_NAME, APP_DESCRIPTION, APP_OG_IMAGE_URL } from "../lib/constants";
import { getMiniAppEmbedMetadata } from "../lib/utils";

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

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Security />
        <Features />
        <Team />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
