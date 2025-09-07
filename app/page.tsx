"use client";

import Header from "../components/Header";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Security from "../components/Security";
import Features from "../components/Features";
import Team from "../components/Team";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

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
