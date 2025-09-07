"use client";

import Header from "./Header";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import Security from "./Security";
import Features from "./Features";
import Team from "./Team";
import FAQ from "./FAQ";
import Footer from "./Footer";
import { useEffect } from "react";
import sdk from "@farcaster/miniapp-sdk";

export default function Home() {
  useEffect(() => {
    sdk.actions.ready();
    console.log("ready Bitsave.io");
  }, []);

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
